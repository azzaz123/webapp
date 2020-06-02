
import {of as observableOf,  Observable } from 'rxjs';

import {tap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { PaymentService, PAYMENT_RESPONSE_STATUS } from '../payments/payment.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { EventService } from '../event/event.service';
import {
  PaymentIntents, PaymentMethodResponse, PaymentMethodCardResponse
} from '../payments/payment.interface';
import { FinancialCard } from '../../shared/profile/credit-card-info/financial-card';
import { FeatureflagService } from '../user/featureflag.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { async } from 'q';

export const PAYMENTS_API_URL = 'api/v3/payments';

export const STRIPE_PAYMENT_RESPONSE_EVENT_KEY = 'paymentActionResponse';

@Injectable()
export class StripeService {

  public lib: any;
  public elements: any;

  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  private financialCards: FinancialCard[];
  private setupIntentSecret: string;

  constructor(private paymentService: PaymentService,
              private userService: UserService,
              private router: Router,
              private eventService: EventService,
              private http: HttpClient,
              private featureflagService: FeatureflagService) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ?  `${user.firstName} ${user.lastName}` : '';
    });
  }

  public init() {
    this.lib = Stripe(environment.stripeKey, {
      betas: ['payment_intent_beta_3']
    });
    this.elements = this.lib.elements();
  }

  public buy(orderId: string, paymentId: string, hasSavedCard: boolean, isSaved: boolean, card: any): void {
    if (!hasSavedCard || hasSavedCard && !isSaved) {
      this.paymentService.paymentIntents(orderId, paymentId).subscribe((response: PaymentIntents) => {
        this.payment(response.token, card).then((response: any) => {
          this.handlePayment(response);
        });
      });
    } else {
      this.paymentService.paymentIntentsConfirm(orderId, paymentId, card.id).subscribe((response: PaymentIntents) => {
        if (response.status.toUpperCase() !== PAYMENT_RESPONSE_STATUS.SUCCEEDED) {
          this.savedPayment(response.token).then((response: any) => {
            this.handlePayment(response);
          });
        } else {
          this.handlePayment(response);
        }
      }, () => {
        this.router.navigate(['catalog/list', { code: -1 }]);
      });
    }
  }

  public actionPayment(paymentSecretKey): void {
    this.requiresActionPayment(paymentSecretKey).then((response: any) => {
      this.handlePayment(response, STRIPE_PAYMENT_RESPONSE_EVENT_KEY);
    })
  }

  public getCards(cache = true): Observable<FinancialCard[]> {
    if (this.financialCards && cache) {
      return observableOf(this.financialCards);
    }
    return this.http.get(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/cards`).pipe(
      map((financialCards: PaymentMethodCardResponse[]) => this.mapPaymentMethodCard(financialCards)),
      tap((financialCards: FinancialCard[]) => this.financialCards = financialCards),);
  }

  public deleteCard(paymentMethodId: string) {
    return this.http.post(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/${paymentMethodId}/detach`, {})
  }

  public addNewCard(paymentMethodId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/${paymentMethodId}/attach`, {});
  }

  public setDefaultCard(paymentMethodId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/payment_methods/${paymentMethodId}/default`, {});
  }

  public createStripeCard(cardElement: any): Promise<any> {
    return this.createStripePaymentMethod(cardElement).then((response: any) => {
      if (response.error) {
        return this.eventService.emit(STRIPE_PAYMENT_RESPONSE_EVENT_KEY, PAYMENT_RESPONSE_STATUS.FAILED);
      }
      return response.paymentMethod;
    }).catch(() => this.eventService.emit(STRIPE_PAYMENT_RESPONSE_EVENT_KEY, PAYMENT_RESPONSE_STATUS.FAILED));
  }

  public getSetupIntent(): Observable<any> {
    return this.http.get<string>(`${environment.baseUrl}${PAYMENTS_API_URL}/c2b/stripe/setup_intent_secret`);
  }

  public createDefaultCard(clientSecret: string, cardElement: any): Promise<any> {
    return this.stripeSetupIntent(clientSecret, cardElement).then(function(result) {
      if (result.error) {
        this.eventService.emit(result.error);
      } else {
        return result.setupIntent;
      }
    });
  }

  createStripePaymentMethod = async (cardElement: any) => await this.lib.createPaymentMethod('card', cardElement);

  stripeSetupIntent = async (clientSecret: string, paymentMethod: any) => await this.lib.confirmCardSetup(clientSecret, {payment_method: paymentMethod});

  handlePayment = (paymentResponse, type = 'paymentResponse')  => {
    const { paymentIntent, error } = paymentResponse;
    const response = paymentIntent ? paymentIntent.status : paymentResponse.status;
    const responseError = error ? error.code : paymentResponse.error;
    if (responseError) {
      this.eventService.emit(type, responseError);
    } else {
      this.eventService.emit(type, response);
    }
  };

  payment = async (token, card) => {
    return await this.lib.handleCardPayment(
      token,
      card,
      {
        save_payment_method: true,
        source_data: {
          owner: {name: this.fullName}
        }
      }
    );
  };

  requiresActionPayment = async (paymentIntentSecret) => {
    return await this.lib.handleCardPayment(paymentIntentSecret);
  };

  savedPayment = async (token) => await this.lib.handleCardPayment(token);

  public mapResponse(res: PaymentMethodResponse): FinancialCard {
      return new FinancialCard(
        `${res.card.exp_month}/${res.card.exp_year}`,
        res.id,
        res.card.last4,
        null,
        null,
        res.card
      );
  }

  private mapPaymentMethodCard(stripeCard: PaymentMethodCardResponse[]): FinancialCard[] {
    return stripeCard.map((stripeCard: PaymentMethodCardResponse) => {
      return new FinancialCard(
        `${stripeCard.expiration_month}/${stripeCard.expiration_year}`,
        stripeCard.id,
        stripeCard.last_digits,
        stripeCard.invoices_default,
        null,
        {
          brand: stripeCard.brand,
          checks: null,
          country: null,
          exp_month: stripeCard.expiration_month,
          exp_year: stripeCard.expiration_year,
          funding: null,
          generated_from: null,
          last4: stripeCard.last_digits,
          three_d_secure_usage: { supported: null},
          wallet: null
        }
      );
    });
  }

  public createToken(param: any) {
    return this.lib.createToken(param);
  }

}

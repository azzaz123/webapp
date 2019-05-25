import { Injectable } from '@angular/core';
import { PaymentService } from '../payments/payment.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { EventService } from '../event/event.service';
import {
  PaymentIntents, PaymentMethodResponse, PaymentMethodCardResponse
} from '../payments/payment.interface';
import { PaymentIntent } from './stripe.interface';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { FinancialCard } from '../../shared/profile/credit-card-info/financial-card';

@Injectable()
export class StripeService {

  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = true;
  private API_URL = 'api/v3/payments';
  private financialCards: FinancialCard[];

  constructor(private paymentService: PaymentService,
              private userService: UserService,
              private router: Router,
              private eventService: EventService,
              private http: HttpService) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = `${user.firstName} ${user.lastName}`
    });
  }

  public buy(orderId: string, paymentId: string, hasFinancialCard: boolean, cardType: string, card: any): void {
    if (!hasFinancialCard || hasFinancialCard && cardType === 'new') {
      this.paymentService.paymentIntents(orderId, paymentId).subscribe((response: PaymentIntents) => {
        this.payment(response.token, card).then((response: any) => {
          this.handlePayment(response);
        });
      });
    } else {
      this.paymentService.paymentIntents(orderId, paymentId).subscribe((response: PaymentIntents) => {
        this.payment(response.token, card).then((response: PaymentIntent) => {
          this.handlePayment(response);
        });
      }, () => {
        this.router.navigate(['catalog/list', { code: -1 }]);
      });
    }
  }

  public buyWithSavedCard(orderId: string, paymentId: string, paymentMethodId: string): void  {
    this.paymentService.paymentIntentsConfirm(orderId, paymentId, paymentMethodId).subscribe((response: PaymentIntents) => {
      if (response.status !== 'SUCCEEDED') {
        return this.handleStripeCardAction(response.token, orderId, paymentId, paymentMethodId).then((response: any) => {
          return response;
        });
      } else {
        this.eventService.emit('paymentResponse', response.status);
      }
    }, () => {
      this.router.navigate(['catalog/list', { code: -1 }]);
    });
  }

  public isPaymentMethodStripe(): boolean {
    return this.PAYMENT_PROVIDER_STRIPE;
  }

  public getCards(): Observable<FinancialCard[]> {
    if (this.financialCards) {
      return Observable.of(this.financialCards);
    }
    return this.http.get(`${this.API_URL}/c2b/stripe/payment_methods/cards`)
      .map((r: Response) => r.json())
      .map((financialCards: PaymentMethodCardResponse[]) => this.mapPaymentMethodCard(financialCards))
      .do((financialCards: FinancialCard[]) => this.financialCards = financialCards);
  }

  public deleteCard(paymentMethodId: string) {
    return this.http.post(`${this.API_URL}/c2b/stripe/payment_methods/${paymentMethodId}/detach`)
  }

  public addNewCard(paymentMethodId: string) {
    return this.http.put(`${this.API_URL}/c2b/stripe/payment_methods/${paymentMethodId}/attach`)
  }

  public createStripeCard(cardElement: any): Promise<any> {
    return this.createStripePaymentMethod(cardElement).then((response: any) => {
      return response.paymentMethod;
    });
  }

  handleStripeCardAction = async (token: string, orderId: string, paymentId: string, paymentMethodId: string) => {
    return await stripe.handleCardAction(
      token
    ).then(function(result) {
      if (result.error) {
        this.eventService.emit('paymentResponse', result.error);
      } else {
        this.paymentService.paymentIntentsConfirm(orderId, paymentId, paymentMethodId).subscribe((response: PaymentIntents) => {
          this.eventService.emit('paymentResponse', response.status);
        });
      }
    });
  };

  createStripePaymentMethod = async (cardElement: any) => {
    return await stripe.createPaymentMethod(
      'card',
      cardElement
    );
  };

  handlePayment = (paymentResponse)  => {
    const { paymentIntent, error } = paymentResponse;

    if (error) {
      this.eventService.emit('paymentResponse', error);
    } else {
      this.eventService.emit('paymentResponse', paymentIntent.status);
    }
  };

  payment = async (token, card) => {
    return await stripe.handleCardPayment(
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

  public mapResponse(res: PaymentMethodResponse): FinancialCard {
      return new FinancialCard(
        `${res.card.exp_month}/${res.card.exp_year}`,
        res.id,
        res.card.last4,
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

}
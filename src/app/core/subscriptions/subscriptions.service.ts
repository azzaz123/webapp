import { of, throwError, forkJoin, Observable } from 'rxjs';

import { retryWhen, delay, take, mergeMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { SUBSCRIPTION_MARKETS } from './subscriptions.interface';
import { UserService } from '../user/user.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UuidService } from '../uuid/uuid.service';
import { CATEGORIES_EXCLUDED_FROM_CONSUMER_GOODS, CATEGORY_SUBSCRIPTIONS_IDS } from './category-subscription-ids';
import { SubscriptionsHttpService } from './http/subscriptions-http.service';
import { mapSubscriptions } from './mappers/subscriptions-mapper';

export const API_URL = 'api/v3/payments';
export const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';

export enum SUBSCRIPTION_TYPES {
  notSubscribed = 1,
  carDealer = 2,
  stripe = 4,
}

@Injectable()
export class SubscriptionsService {
  public uuid: string;
  public subscriptions: SubscriptionsResponse[];
  private _userSubscriptionType: SUBSCRIPTION_TYPES;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private uuidService: UuidService,
    private subscriptionsHttpService: SubscriptionsHttpService
  ) {}

  public getUserSubscriptionType(useCache = true): Observable<SUBSCRIPTION_TYPES> {
    if (useCache && this._userSubscriptionType) {
      return of(this._userSubscriptionType);
    }

    return forkJoin([this.userService.isProfessional(), this.getSubscriptions(false)]).pipe(
      map((values) => {
        const isCarDealer = values[0];
        const subscriptions = values[1];

        if (isCarDealer) {
          return SUBSCRIPTION_TYPES.carDealer;
        }

        if (this.hasOneStripeSubscription(subscriptions)) {
          return SUBSCRIPTION_TYPES.stripe;
        }

        return SUBSCRIPTION_TYPES.notSubscribed;
      }),
      tap((subscriptionType) => (this._userSubscriptionType = subscriptionType))
    );
  }

  public newSubscription(subscriptionId: string, paymentId: string, billing: boolean = false): Observable<any> {
    this.uuid = this.uuidService.getUUID();
    return this.http.post(
      `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`,
      {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId,
        billing,
      },
      {
        observe: 'response' as 'body',
      }
    );
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return this.http.get<any>(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`).pipe(
      retryWhen((errors) => {
        return errors.pipe(
          mergeMap((error) => (error.status !== 404 ? throwError(error) : of(error))),
          delay(1000),
          take(10)
        );
      })
    );
  }

  public retrySubscription(invoiceId: string, paymentId: string): Observable<any> {
    this.uuid = this.uuidService.getUUID();
    return this.http.put(
      `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`,
      {
        invoice_id: invoiceId,
        payment_method_id: paymentId,
      },
      { observe: 'response' as 'body' }
    );
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`);
  }

  public getSubscriptions(cache: boolean = true): Observable<SubscriptionsResponse[]> {
    if (this.subscriptions && cache) {
      return of(this.subscriptions);
    }

    return this.subscriptionsHttpService.get().pipe(
      map(mapSubscriptions),
      tap((mappedSubscriptions) => (this.subscriptions = mappedSubscriptions))
    );
  }

  public cancelSubscription(planId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/cancel/${planId}`, null, {
      observe: 'response' as 'body',
    });
  }

  public continueSubscription(planId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/unsubscription/cancel/${planId}`, null, {
      observe: 'response' as 'body',
    });
  }

  public editSubscription(subscription: SubscriptionsResponse, newPlanId: string): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${subscription.id}`,
      { plan_id: newPlanId },
      { observe: 'response' as 'body' }
    );
  }

  public isStripeSubscription(subscription: SubscriptionsResponse): boolean {
    if (!subscription.market) {
      return false;
    }
    return subscription.market === SUBSCRIPTION_MARKETS.STRIPE;
  }

  public hasOneStripeSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some((subscription) => this.isStripeSubscription(subscription));
  }

  public hasSomeSubscriptionDiscount(subscriptions: SubscriptionsResponse[]): boolean {
    return !!subscriptions && subscriptions.some((subscription) => this.getDefaultTierDiscount(subscription));
  }

  public getDefaultTierSubscriptionDiscount(subscriptions: SubscriptionsResponse[]): Tier {
    if (this.hasSomeSubscriptionDiscount(subscriptions)) {
      const subscriptionWithDiscount = subscriptions.find((subscription) => this.getDefaultTierDiscount(subscription));
      return this.getDefaultTierDiscount(subscriptionWithDiscount);
    }
  }

  public getDefaultTierDiscount(subscription: SubscriptionsResponse): Tier {
    return subscription.tiers.find((tier) => tier.discount);
  }

  public hasTrial(subscription: SubscriptionsResponse): boolean {
    return subscription.trial_available;
  }

  public hasOneTrialSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return !!subscriptions && subscriptions.some((subscription) => this.hasTrial(subscription));
  }

  public getTrialSubscriptionsIds(subscriptions: SubscriptionsResponse[]): number[] {
    if (!subscriptions) {
      return [];
    }
    return subscriptions
      .filter((subscription) => this.hasTrial(subscription) && !subscription.subscribed_from)
      .map((subscription) => subscription.category_id);
  }

  public hasFreeTrialByCategoryId(subscriptions: SubscriptionsResponse[], categoryId: number): boolean {
    const selectedsubscription = subscriptions.find((subscription) => subscription.category_id === categoryId);

    if (!selectedsubscription) {
      return false;
    }

    return this.hasTrial(selectedsubscription) && !selectedsubscription.subscribed_from;
  }

  public getSubscriptionByCategory(subscriptions: SubscriptionsResponse[], categoryId: number): SubscriptionsResponse {
    let categorySubscriptionId: number;

    if (CATEGORIES_EXCLUDED_FROM_CONSUMER_GOODS.includes(categoryId)) {
      categorySubscriptionId = categoryId;
    } else {
      categorySubscriptionId = CATEGORY_SUBSCRIPTIONS_IDS.CONSUMER_GOODS;
    }

    return subscriptions.find((subscription) => subscription.category_id === categorySubscriptionId);
  }

  public tierDiscountByCategoryId(subscriptions: SubscriptionsResponse[], categoryId: number): Tier {
    const selectedsubscription = this.getSubscriptionByCategory(subscriptions, categoryId);

    if (!selectedsubscription) {
      return;
    }

    return this.getDefaultTierDiscount(selectedsubscription);
  }

  public hasHighestLimit(subscription: SubscriptionsResponse): boolean {
    const selectedLimit = subscription.selected_tier?.limit;

    if (!selectedLimit) {
      return false;
    }
    const maxLimit = subscription.tiers.reduce((a, b) => (!b.limit || a.limit > b.limit ? a : b)).limit;
    return selectedLimit === maxLimit;
  }
}

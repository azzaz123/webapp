import { of, throwError, forkJoin, Observable } from 'rxjs';

import { catchError, retryWhen, delay, take, mergeMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  SubscriptionSlot,
  SubscriptionSlotResponse,
  SubscriptionSlotGeneralResponse,
  SUBSCRIPTION_MARKETS,
  SubscriptionBenefit,
} from './subscriptions.interface';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { FeatureflagService } from '../user/featureflag.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { CategoryResponse } from '../category/category-response.interface';
import { CategoryService } from '../category/category.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { I18nService } from '../i18n/i18n.service';
import { CURRENCY_SYMBOLS } from '../constants';
import { UuidService } from '../uuid/uuid.service';

export const API_URL = 'api/v3/payments';
export const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';
export const SUBSCRIPTIONS_URL = 'bff/subscriptions';

export const SUBSCRIPTIONS_SLOTS_ENDPOINT = 'api/v3/users/me/slots-info';

export enum SUBSCRIPTION_TYPES {
  notSubscribed = 1,
  carDealer = 2,
  inApp = 3,
  stripe = 4,
}

@Injectable()
export class SubscriptionsService {
  public uuid: string;
  public fullName: string;
  public subscriptions: SubscriptionsResponse[];
  private _userSubscriptionType: SUBSCRIPTION_TYPES;
  private _subscriptionBenefits: SubscriptionBenefit[];

  constructor(
    private userService: UserService,
    private featureflagService: FeatureflagService,
    private http: HttpClient,
    private categoryService: CategoryService,
    private uuidService: UuidService,
    private i18nService: I18nService
  ) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ? `${user.firstName} ${user.lastName}` : '';
    });
  }

  public getSlots(): Observable<SubscriptionSlot[]> {
    return this.http.get<SubscriptionSlotGeneralResponse>(`${environment.baseUrl}${SUBSCRIPTIONS_SLOTS_ENDPOINT}`).pipe(
      mergeMap((response) => {
        return forkJoin(response.slots.map((slot) => this.mapSlotResponseToSlot(slot)));
      })
    );
  }

  private mapSlotResponseToSlot(slot: SubscriptionSlotResponse): Observable<SubscriptionSlot> {
    return this.categoryService.getCategoryById(slot.category_id).pipe(
      map((category) => {
        const mappedSlot: SubscriptionSlot = {
          category,
          available: slot.available,
          limit: slot.limit,
        };

        return mappedSlot;
      })
    );
  }

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

        if (this.isOneSubscriptionInApp(subscriptions)) {
          return SUBSCRIPTION_TYPES.inApp;
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

    return this.categoryService.getCategories().pipe(
      mergeMap((categories) => {
        return this.http
          .get(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`)
          .pipe(
            catchError((error) => {
              return of(error);
            })
          )
          .pipe(
            map((subscriptions: SubscriptionsResponse[]) => {
              if (subscriptions.length > 0) {
                return subscriptions.map((subscription: SubscriptionsResponse) => this.mapSubscriptions(subscription, categories));
              }
            })
          );
      })
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

  private mapSubscriptions(subscription: SubscriptionsResponse, categories: CategoryResponse[]): SubscriptionsResponse {
    let category = categories.find((category: CategoryResponse) => subscription.category_id === category.category_id);

    if (!category && subscription.category_id === 0) {
      category = this.categoryService.getConsumerGoodsCategory();
    }

    if (category) {
      subscription.category_name = category.name;
      subscription.category_icon = category.icon_id;
      subscription.selected_tier = this.getSelectedTier(subscription);
    }

    this.mapCurrenciesForTiers(subscription);

    return subscription;
  }

  private mapCurrenciesForTiers(subscription: SubscriptionsResponse) {
    subscription.tiers.forEach((tier) => {
      const mappedCurrencyCharacter = CURRENCY_SYMBOLS[tier.currency];
      if (mappedCurrencyCharacter) {
        tier.currency = mappedCurrencyCharacter;
      }
    });
  }

  private getSelectedTier(subscription: SubscriptionsResponse): Tier {
    const selectedTier = subscription.selected_tier_id
      ? subscription.tiers.filter((tier) => tier.id === subscription.selected_tier_id)
      : subscription.tiers.filter((tier) => tier.id === subscription.default_tier_id);
    return selectedTier[0];
  }

  public isSubscriptionInApp(subscription: SubscriptionsResponse): boolean {
    if (!subscription.market) {
      return false;
    }
    return subscription.market === SUBSCRIPTION_MARKETS.GOOGLE_PLAY || subscription.market === SUBSCRIPTION_MARKETS.APPLE_STORE;
  }

  public isOneSubscriptionInApp(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some((subscription) => this.isSubscriptionInApp(subscription));
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

  public hasOneFreeSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some((subscription) => this.hasOneFreeTier(subscription));
  }

  public hasOneDiscountedSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some((subscription) => this.hasOneTierDiscount(subscription));
  }

  public hasOneTierDiscount(subscription: SubscriptionsResponse): boolean {
    return subscription.tiers.some((tier) => this.isDiscountedTier(tier));
  }

  public hasOneFreeTier(subscription: SubscriptionsResponse): boolean {
    return subscription.tiers.some((tier) => this.isFreeTier(tier));
  }

  public isDiscountedTier(tier: Tier): boolean {
    return !!tier.discount_available;
  }

  public isFreeTier(tier: Tier): boolean {
    if (!this.isDiscountedTier(tier)) {
      return false;
    }

    return tier.discount_available.discounted_price === 0;
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
    return subscriptions.filter((subscription) => this.hasTrial(subscription)).map((subscription) => subscription.category_id);
  }

  public getSubscriptionBenefits(useCache = true): Observable<SubscriptionBenefit[]> {
    if (useCache && this._subscriptionBenefits) {
      return of(this._subscriptionBenefits);
    }
    return of(this.i18nService.getTranslations('subscriptionBenefits')).pipe(tap((response) => (this._subscriptionBenefits = response)));
  }

  public getTierDiscountPercentatge(tier: Tier): number {
    let discountPercentatge = 0;

    if (!tier.discount_available) {
      return discountPercentatge;
    }

    try {
      discountPercentatge = ((tier.price - tier.discount_available.discounted_price) / tier.price) * 100;
    } catch {}

    if (discountPercentatge > 100) {
      discountPercentatge = 100;
    }

    return discountPercentatge;
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubscriptionSlot, SubscriptionSlotResponse, SubscriptionSlotGeneralResponse, SUBSCRIPTION_MARKETS, SubscriptionBenefit } from './subscriptions.interface';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '../user/featureflag.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { CategoryResponse } from '../category/category-response.interface';
import { mergeMap, map, tap } from 'rxjs/operators';
import { CategoryService } from '../category/category.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { I18nService } from '../i18n/i18n.service';
import { CURRENCY_SYMBOLS } from '../constants';

export const API_URL = 'api/v3/payments';
export const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';
export const SUBSCRIPTIONS_URL = 'bff/subscriptions';

export const SUBSCRIPTIONS_SLOTS_ENDPOINT = 'api/v3/users/me/slots-info';

export const SUBSCRIPTIONS_CATEGORY_ICON_MAP = {
  'car': 'cat_car',
  'helmet': 'cat_motoraccessories',
  'motorbike': 'cat_motorbike'
};

export enum SUBSCRIPTION_TYPES {
  notSubscribed = 1,
  carDealer = 2,
  inApp = 3,
  stripe = 4
}

@Injectable()
export class SubscriptionsService {

  public uuid: string;
  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  public subscriptions: SubscriptionsResponse[];
  private _userSubscriptionType: SUBSCRIPTION_TYPES;
  private _subscriptionBenefits: SubscriptionBenefit[];

  constructor(private userService: UserService,
              private featureflagService: FeatureflagService,
              private http: HttpClient,
              private categoryService: CategoryService,
              private i18nService: I18nService) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ? `${user.firstName} ${user.lastName}` : '';
    });
  }

  public getSlots(): Observable<SubscriptionSlot[]> {
    return this.http.get<SubscriptionSlotGeneralResponse>(`${environment.baseUrl}${SUBSCRIPTIONS_SLOTS_ENDPOINT}`)
      .flatMap(response => {
        return Observable.forkJoin(
          response.slots.map(slot => this.mapSlotResponseToSlot(slot))
        );
      });
  }

  private mapSlotResponseToSlot(slot: SubscriptionSlotResponse): Observable<SubscriptionSlot> {
    return this.categoryService.getCategoryById(slot.category_id)
      .pipe(
        map(category => {
          category.icon_id = SUBSCRIPTIONS_CATEGORY_ICON_MAP[category.icon_id];
          const mappedSlot: SubscriptionSlot = {
            category,
            available: slot.available,
            limit: slot.limit
          };

          return mappedSlot;
        })
      );
  }

  public getUserSubscriptionType(useCache = true): Observable<SUBSCRIPTION_TYPES> {
    if (useCache && this._userSubscriptionType) {
      return of(this._userSubscriptionType);
    }

    return Observable.forkJoin([
      this.userService.isProfessional(),
      this.getSubscriptions(false)
    ])
    .pipe(
      map(values => {
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
      tap(subscriptionType => this._userSubscriptionType = subscriptionType)
    );
  }

  public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.post(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
      },
      {
        observe: 'response' as 'body'
      }
    );
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return this.http.get<any>(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`)
      .retryWhen((errors) => {
        return errors
          .mergeMap((error) => (error.status !== 404) ? Observable.throw(error) : Observable.of(error))
          .delay(1000)
          .take(10);
      });
  }

  public retrySubscription(invoiceId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`, {
      invoice_id: invoiceId,
      payment_method_id: paymentId,
    }, { observe: 'response' as 'body' });
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`);
  }

  public isSubscriptionsActive$(): Observable<boolean> {
    return this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS);
  }

  public getSubscriptions(cache: boolean = true): Observable<SubscriptionsResponse[]> {
    if (this.subscriptions && cache) {
      return Observable.of(this.subscriptions);
    }

    return this.categoryService.getCategories()
    .pipe(
      mergeMap((categories) => {
        return this.http.get(`${environment.baseUrl}${SUBSCRIPTIONS_URL}`)
        .catch((error) => {
          return Observable.of(error);
        })
        .pipe(
          map((subscriptions: SubscriptionsResponse[]) => {
            if (subscriptions.length > 0) {
              return subscriptions.map((subscription: SubscriptionsResponse) => this.mapSubscriptions(subscription, categories))
            }
          })
        );
      })
    )
  }

  public cancelSubscription(planId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/cancel/${planId}`,
      null, { observe: 'response' as 'body' });
  }

  public continueSubscription(planId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/unsubscription/cancel/${planId}`,
      null, { observe: 'response' as 'body' });
  }

  public editSubscription(subscription: SubscriptionsResponse, newPlanId: string): Observable<any> {
    return this.http.put(`${environment.baseUrl}${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${subscription.id}`, { plan_id: newPlanId }, { observe: 'response' as 'body' });
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
    subscription.tiers.forEach(tier => {
      const mappedCurrencyCharacter = CURRENCY_SYMBOLS[tier.currency];
      if (mappedCurrencyCharacter) {
        tier.currency = mappedCurrencyCharacter;
      }
    });
  }

  private getSelectedTier(subscription: SubscriptionsResponse): Tier {
    const selectedTier = subscription.selected_tier_id ? subscription.tiers.filter(tier => tier.id === subscription.selected_tier_id) : subscription.tiers.filter(tier => tier.id === subscription.default_tier_id);
    return selectedTier[0];
  }

  public isSubscriptionInApp(subscription: SubscriptionsResponse): boolean {
    if (!subscription.market) {
      return false;
    }
    return subscription.market === SUBSCRIPTION_MARKETS.GOOGLE_PLAY || subscription.market === SUBSCRIPTION_MARKETS.APPLE_STORE;
  }

  public isOneSubscriptionInApp(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some(subscription => this.isSubscriptionInApp(subscription));
  }

  public isStripeSubscription(subscription: SubscriptionsResponse): boolean {
    if (!subscription.market) {
      return false;
    }
    return subscription.market === SUBSCRIPTION_MARKETS.STRIPE;
  }

  public hasOneStripeSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some(subscription => this.isStripeSubscription(subscription));
  }

  public hasOneFreeSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some(subscription => this.hasOneFreeTier(subscription));
  }

  public hasOneDiscountedSubscription(subscriptions: SubscriptionsResponse[]): boolean {
    return subscriptions.some(subscription => this.hasOneTierDiscount(subscription));
  }

  public hasOneTierDiscount(subscription: SubscriptionsResponse): boolean {
    return subscription.tiers.some(tier => this.isDiscountedTier(tier));
  }

  public hasOneFreeTier(subscription: SubscriptionsResponse): boolean {
    return subscription.tiers.some(tier => this.isFreeTier(tier));
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

  public getSubscriptionBenefits(useCache = true): Observable<SubscriptionBenefit[]>{
    if (useCache && this._subscriptionBenefits) {
      return of(this._subscriptionBenefits);
    }
    return of(this.i18nService.getTranslations('subscriptionBenefits'))
      .pipe(
        tap(response => this._subscriptionBenefits = response)
      );
  }
}

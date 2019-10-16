import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService, FEATURE_FLAGS_ENUM } from '../user/featureflag.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { CategoryResponse } from '../category/category-response.interface';
import { HttpServiceNew } from '../http/http.service.new';

export const API_URL = 'api/v3/payments';
export const STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';
export const SUBSCRIPTIONS_URL = 'bff/subscriptions';

@Injectable()
export class SubscriptionsService {

  public uuid: string;
  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  public subscriptions: SubscriptionsResponse[];

  constructor(private userService: UserService,
              private featureflagService: FeatureflagService,
              private http: HttpServiceNew) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ?  `${user.firstName} ${user.lastName}` : '';
    });
  }

  public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.post(`${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
    }, null, { observe: 'response' as 'body' });
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return this.http.get(`${API_URL}/${STRIPE_SUBSCRIPTION_URL}/${this.uuid}`)
    .retryWhen((errors) => {
      return errors
        .mergeMap((error) => (error.status !== 404) ? Observable.throw(error) : Observable.of(error))
        .delay(1000)
        .take(5);
    });
  }

  public retrySubscription(invoiceId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.put(`${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`, {
      invoice_id: invoiceId,
      payment_method_id: paymentId,
    }, null, { observe: 'response' as 'body' });
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${API_URL}/${STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`);
  }

  public isSubscriptionsActive$(): Observable<boolean> {
    return this.featureflagService.getFlag(FEATURE_FLAGS_ENUM.SUBSCRIPTIONS);
  }

  public getSubscriptions(categories: CategoryResponse[], cache: boolean = true): Observable<SubscriptionsResponse[]> {
    if (this.subscriptions && cache) {
      return Observable.of(this.subscriptions);
    }
    return this.http.get(SUBSCRIPTIONS_URL)
    .map((subscriptions: SubscriptionsResponse[]) => {
      if (subscriptions.length > 0) {
        return subscriptions.map((subscription: SubscriptionsResponse) => this.mapSubscriptions(subscription, categories))
      }
    })
    .do((subscriptions: SubscriptionsResponse[]) => this.subscriptions = subscriptions)
    .catch((error) => {
      console.warn('ERROR getSubscriptions ', error);
      return Observable.of(null);
    });
  }

  public cancelSubscription(planId: string): Observable<any> {
    return this.http.put(`${API_URL}/${STRIPE_SUBSCRIPTION_URL}/cancel/${planId}`, null, null, { observe: 'response' as 'body' });
  }

  private mapSubscriptions(subscription: SubscriptionsResponse, categories: CategoryResponse[]): SubscriptionsResponse {
    let category = categories.find((category: CategoryResponse) => subscription.category_id === category.categoryId);
    if (category) {
      subscription.category_name = category.defaultTitle;
      subscription.category_icon = category.iconName;
      subscription.selected_tier = this.getSelectedTier(subscription);
      return subscription;
    }
  }

  private getSelectedTier(subscription: SubscriptionsResponse): Tier {
    const selectedTier = subscription.selected_tier_id ? subscription.tiers.filter(tier => tier.id === subscription.selected_tier_id) : subscription.tiers.filter(tier => tier.id === subscription.default_tier_id);
    return selectedTier[0];
  }

}


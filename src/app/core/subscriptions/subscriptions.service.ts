import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService } from '../user/featureflag.service';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { SUBSCRIPTIONS } from '../../../tests/subscriptions.fixtures.spec';
import { CategoryResponse } from '../category/category-response.interface';
import { HttpServiceNew } from '../http/http.service.new';

@Injectable()
export class SubscriptionsService {

  public lib: any;
  public elements: any;
  public uuid: string;
  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  private API_URL = 'api/v3/payments';
  private STRIPE_SUBSCRIPTION_URL = 'c2b/stripe/subscription';

  constructor(private userService: UserService,
              private featureflagService: FeatureflagService,
              private http: HttpServiceNew) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ?  `${user.firstName} ${user.lastName}` : '';
    });
  }

  public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.post(`${this.API_URL}/${this.STRIPE_SUBSCRIPTION_URL}/${this.uuid}`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
    }, null, { observe: 'response' as 'body' });
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return this.http.get(`${this.API_URL}/${this.STRIPE_SUBSCRIPTION_URL}/${this.uuid}`)
    .retryWhen((errors) => {
      return errors
        .mergeMap((error) => (error.status !== 404) ? Observable.throw(error) : Observable.of(error))
        .delay(1000)
        .take(5);
    });
  }

  public retrySubscription(invoiceId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.put(`${this.API_URL}/${this.STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`, {
      invoice_id: invoiceId,
      payment_method_id: paymentId,
    });
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/${this.STRIPE_SUBSCRIPTION_URL}/payment_attempt/${this.uuid}`);
  }

  public isSubscriptionsActive$(): Observable<boolean> {
    return this.featureflagService.getFlag('web_subscriptions');
  }

  public getSubscriptions(categories: CategoryResponse[]): Observable<SubscriptionsResponse[]> {
    return Observable.of(SUBSCRIPTIONS)
    .map((subscriptions: SubscriptionsResponse[]) => {
      if (subscriptions.length > 0) {
        return subscriptions.map((subscription: SubscriptionsResponse) => this.mapSubscriptions(subscription, categories))
      }
    })
    .catch((error) => {
      console.warn('ERROR getSubscriptions ', error);
      return Observable.of(null);
    });
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


import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService } from '../user/featureflag.service';
import { Response } from '@angular/http';
import { SubscriptionResponse, SubscriptionsResponse, Tier } from './subscriptions.interface';
import { SUBSCRIPTIONS } from '../../../tests/subscriptions.fixtures.spec';
import { CategoryService } from '../category/category.service';
import { CategoryResponse } from '../category/category-response.interface';
import * as _ from 'lodash';

@Injectable()
export class SubscriptionsService {

  public lib: any;
  public elements: any;
  public uuid: string;
  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  private API_URL = 'api/v3/payments';

  constructor(private userService: UserService,
              private http: HttpService,
              private featureflagService: FeatureflagService,
              private categoryService: CategoryService) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user ?  `${user.firstName} ${user.lastName}` : '';
    });
  }

  public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.post(`${this.API_URL}/c2b/stripe/subscription/${this.uuid}`, {
        payment_method_id: paymentId,
        product_subscription_id: subscriptionId
    });
  }

  public checkNewSubscriptionStatus(): Observable<SubscriptionResponse> {
    return this.http.get(`${this.API_URL}/c2b/stripe/subscription/${this.uuid}`)
    .map(res => res.json())
    .retryWhen((errors) => {
      return errors
        .mergeMap((error) => (error.status !== 404) ? Observable.throw(error) : Observable.of(error))
        .delay(1000)
        .take(5);
    });
  }

  public retrySubscription(invoiceId: string, paymentId: string): Observable<any> {
    this.uuid = UUID.UUID();
    return this.http.put(`${this.API_URL}/c2b/stripe/subscription/payment_attempt/${this.uuid}`, {
      invoice_id: invoiceId,
      payment_method_id: paymentId,
    })
    .map((r: Response) => r.json());
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/c2b/stripe/subscription/payment_attempt/${this.uuid}`)
    .map((res: Response) => res.json());
  }

  public isSubscriptionsActive$(): Observable<boolean> {
    return this.featureflagService.getFlag('web_subscriptions');
  }

  public getSubscriptions(): Observable<SubscriptionsResponse[]> {
    return Observable.of(SUBSCRIPTIONS)
    .flatMap((subscriptions: SubscriptionsResponse[]) => {
      if (subscriptions.length > 0) {
        return Observable.forkJoin(
          subscriptions.map((subscription: SubscriptionsResponse) => this.getCategories(subscription))
        )
      }
    })
    .catch((e) => {
      console.warn('error get subscriptions ', e);
      return Observable.of(null);
    });
  }

  private getCategories(subscription: SubscriptionsResponse): Observable<SubscriptionsResponse> {
    return this.categoryService.getCategoryById(subscription.category_id)
      .map((category: CategoryResponse) => {
        subscription.category_name = category.title;
        subscription.category_icon = category.iconName;
        subscription.selected_tier = this.getSubscribedTier(subscription);
        return subscription;
      });
  }

  private getSubscribedTier(subscription: SubscriptionsResponse): Tier {
    const selectedTier = subscription.tiers.filter(tier => tier.id === subscription.selected_tier_id);
    return selectedTier[0];
  }

}
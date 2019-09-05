import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService } from '../user/featureflag.service';
import { Response } from '@angular/http';
import { SubscriptionResponse, SubscriptionsResponse } from './subscriptions.interface';
import { SUBSCRIPTIONS } from '../../../tests/subscriptions.fixtures.spec';
import { SubscriptionsModel } from './subscriptions.model';
import { CategoryService } from '../category/category.service';
import { flatMap } from 'rxjs/operators';
import { CategoryResponse } from '../category/category-response.interface';

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
    .catch(() => {
      console.log('error get subscriptions');
      return Observable.of(null);
    });
  }

  private getCategories(subscription: SubscriptionsResponse): Observable<SubscriptionsResponse> {
    return this.categoryService.getCategoryById(subscription.category_id)
      .map((category: CategoryResponse) => {
        subscription.category_name = category.title;
        subscription.category_icon = category.iconName;
        return subscription;
      });
  }

}
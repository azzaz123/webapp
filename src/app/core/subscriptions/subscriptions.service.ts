import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { UUID } from 'angular2-uuid';
import { FeatureflagService } from '../user/featureflag.service';
import { Subscription } from './subscriptions.interface';
import { HttpServiceNew } from '../http/http.service.new';

@Injectable()
export class SubscriptionsService {

  public lib: any;
  public elements: any;
  public uuid: string;
  public fullName: string;
  public PAYMENT_PROVIDER_STRIPE = false;
  private API_URL = 'api/v3/payments';

  constructor(private userService: UserService,
              private http: HttpServiceNew,
              private featureflagService: FeatureflagService) {
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

  public checkNewSubscriptionStatus(): Observable<Subscription> {
    return this.http.get(`${this.API_URL}/c2b/stripe/subscription/${this.uuid}`)
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
    });
  }

  public checkRetrySubscriptionStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/c2b/stripe/subscription/payment_attempt/${this.uuid}`);
  }

  public isSubscriptionsActive$(): Observable<boolean> {
    return this.featureflagService.getFlag('web_subscriptions');
  }

}

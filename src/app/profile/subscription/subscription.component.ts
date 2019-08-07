import { Component } from '@angular/core';
import { StripeService } from '../../core/stripe/stripe.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { Observable } from 'rxjs';
import { HttpService } from '../../core/http/http.service';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'tsl-subscription',
  templateUrl: './subscription.component.html'
})
export class SubscriptionComponent {

    public card: any;
    protected API_URL = 'api/v3/payments';

    constructor(private http: HttpService,
                private stripeService: StripeService,
                private errorService: ErrorsService) {
    }

    addSubscription(cardToken) {
        this.newSubscription('plan_FSWGMZq6tDdiKc', cardToken.id).subscribe((response) => {
            console.log('response ', response);
        }, () => {
            console.log('error on subscription');
        });
    }

    public setCardInfo(card: any): void {
        this.card = card;
    }

    public newSubscription(subscriptionId: string, paymentId: string): Observable<any> {
        const uuid: string = UUID.UUID();
        return this.http.post(`${this.API_URL}/c2b/stripe/subscription/${uuid}`, {
            payment_method_id: paymentId,
            product_subscription_id: subscriptionId
        });
      }
  
}

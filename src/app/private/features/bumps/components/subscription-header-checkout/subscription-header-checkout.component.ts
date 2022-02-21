import { Component, Input } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-header-checkout',
  templateUrl: './subscription-header-checkout.component.html',
  styleUrls: ['./subscription-header-checkout.component.scss'],
})
export class SubscriptionHeaderCheckoutComponent {
  @Input() subscription: SubscriptionsResponse;
}

import { Component, Input } from '@angular/core';
import { SubscriptionsResponse, Tier } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-price-discount',
  templateUrl: './subscription-price-discount.component.html',
  styleUrls: ['./subscription-price-discount.component.scss'],
})
export class SubscriptionPriceDiscountComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() tierDiscount: Tier;
}

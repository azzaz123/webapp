import { Component, Input } from '@angular/core';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-subscription-price-discount',
  templateUrl: './subscription-price-discount.component.html',
  styleUrls: ['./subscription-price-discount.component.scss'],
})
export class SubscriptionPriceDiscountComponent {
  @Input() subscription: SubscriptionsResponse;
  public loading = true;
  public priceDiscount: SubscriptionBenefit[];

  constructor(private subscriptionsService: SubscriptionsService) {}

  public hasTrial(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasTrial(subscription);
  }

  public hasOneTierDiscount(subscription: SubscriptionsResponse) {
    return this.subscriptionsService.hasOneTierDiscount(subscription);
  }

  public hasOneFreeTier(subscription: SubscriptionsResponse): boolean {
    return this.subscriptionsService.hasOneFreeTier(subscription);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionBenefit } from '@core/subscriptions/subscription-benefits/interfaces/subscription-benefit.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-subscription-price-discount',
  templateUrl: './subscription-price-discount.component.html',
  styleUrls: ['./subscription-price-discount.component.scss'],
})
export class SubscriptionPriceDiscountComponent implements OnInit {
  public loading = true;
  public priceDiscount: SubscriptionBenefit[];
  @Input() subscription: SubscriptionsResponse;

  constructor(private subscriptionsService: SubscriptionsService) {}

  ngOnInit() {}

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

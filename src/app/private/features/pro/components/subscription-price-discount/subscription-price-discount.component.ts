import { Component, Input } from '@angular/core';
import { SubscriptionsResponse, TierDiscount } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';

@Component({
  selector: 'tsl-subscription-price-discount',
  templateUrl: './subscription-price-discount.component.html',
  styleUrls: ['./subscription-price-discount.component.scss'],
})
export class SubscriptionPriceDiscountComponent {
  @Input() subscription: SubscriptionsResponse;
  public discount: TierDiscount;

  constructor(private subscriptionsService: SubscriptionsService) {}

  ngOnInit() {
    this.getDiscount(this.subscription);
  }

  public getDiscount(subscription: SubscriptionsResponse): void {
    this.discount = this.subscriptionsService.getDefaultDiscount(subscription);
  }
}

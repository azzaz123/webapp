import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-purchase-header',
  templateUrl: './subscription-purchase-header.component.html',
  styleUrls: ['./subscription-purchase-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPurchaseHeaderComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() benefits: string[];

  constructor() {}

  get iconSrc(): string {
    return `/assets/icons/categories/normal/${this.subscription.category_icon}.svg`;
  }
}
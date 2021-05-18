import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-new-subscription-view',
  templateUrl: './new-subscription-view.component.html',
  styleUrls: ['./new-subscription-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewSubscriptionViewComponent {
  @Input() subscription: SubscriptionsResponse;
  @Input() benefits: string[];

  constructor() {}

  get iconSrc(): string {
    return `/assets/icons/categories/normal/${this.subscription.category_icon}.svg`;
  }
}

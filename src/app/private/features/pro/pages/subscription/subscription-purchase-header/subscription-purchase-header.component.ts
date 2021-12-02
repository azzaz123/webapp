import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-subscription-purchase-header',
  templateUrl: './subscription-purchase-header.component.html',
  styleUrls: ['./subscription-purchase-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPurchaseHeaderComponent {
  @Input() subscription: SubscriptionsResponse;
  @Output() clickLink: EventEmitter<void> = new EventEmitter();

  public onClickLink(): void {
    this.clickLink.emit();
  }
}

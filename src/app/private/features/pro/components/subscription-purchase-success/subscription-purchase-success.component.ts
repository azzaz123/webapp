import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@core/user/user';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

@Component({
  selector: 'tsl-subscription-purchase-success',
  templateUrl: './subscription-purchase-success.component.html',
  styleUrls: ['./subscription-purchase-success.component.scss'],
})
export class SubscriptionPurchaseSuccessComponent {
  @Input() user: User;
  @Input() invoicedRequired: boolean;
  @Output() redirectTo: EventEmitter<string | void> = new EventEmitter();
  public readonly PRIVATE_PATHS = PRIVATE_PATHS;

  public badgeConfig = {
    url: '/assets/icons/badge-pro-dark-narrow.svg',
    badgeStyle: {
      'bottom.px': 4,
      'left.px': 54,
    },
  };

  public onClose(redirectTo?: string): void {
    this.redirectTo.emit(redirectTo);
  }
}

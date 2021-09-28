import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@core/user/user';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.component';

@Component({
  selector: 'tsl-subscription-purchase-success',
  templateUrl: './subscription-purchase-success.component.html',
  styleUrls: ['./subscription-purchase-success.component.scss'],
})
export class SubscriptionPurchaseSuccessComponent {
  @Input() user: User;
  @Input() invoicedRequired: boolean;
  @Input() isEditSubscription: boolean;

  @Output() redirectTo: EventEmitter<string | void> = new EventEmitter();
  public readonly PRIVATE_PATHS = PRIVATE_PATHS;
  public readonly ICON_TYPE = ICON_TYPE;

  public onClose(redirectTo?: string): void {
    this.redirectTo.emit(redirectTo);
  }
}

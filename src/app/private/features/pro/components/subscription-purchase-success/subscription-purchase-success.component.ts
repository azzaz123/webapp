import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@core/user/user';

@Component({
  selector: 'tsl-subscription-purchase-success',
  templateUrl: './subscription-purchase-success.component.html',
  styleUrls: ['./subscription-purchase-success.component.scss'],
})
export class SubscriptionPurchaseSuccessComponent {
  @Input() user: User;
  @Output() redirectTo: EventEmitter<string | void> = new EventEmitter();

  public onClose(redirectTo?: string): void {
    this.redirectTo.emit(redirectTo);
  }
}

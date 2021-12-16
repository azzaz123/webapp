import { Component, Input } from '@angular/core';
import { TransactionTrackingActionDeeplink } from '@api/core/model/delivery/transaction/tracking';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';

@Component({
  selector: 'tsl-transaction-tracking-action-deeplink',
  templateUrl: './transaction-tracking-action-deeplink.component.html',
  styleUrls: ['../styles/transaction-tracking-action.scss'],
})
export class TransactionTrackingActionDeeplinkComponent {
  @Input() deeplinkAction: TransactionTrackingActionDeeplink;

  constructor(private deeplinkService: DeeplinkService) {}

  public navigate(): void {
    this.deeplinkService.navigate(this.deeplinkAction.linkUrl);
  }
}

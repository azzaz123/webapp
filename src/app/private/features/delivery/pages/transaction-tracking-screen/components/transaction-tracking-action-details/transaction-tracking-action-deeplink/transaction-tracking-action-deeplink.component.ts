import { Component, Input } from '@angular/core';
import { TransactionTrackingActionDeeplink } from '@api/core/model/delivery/transaction/tracking';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';

@Component({
  selector: 'tsl-transaction-tracking-action-deeplink',
  templateUrl: './transaction-tracking-action-deeplink.component.html',
  styleUrls: ['./transaction-tracking-action-deeplink.component.scss'],
})
export class TransactionTrackingActionDeeplinkComponent {
  @Input() deeplinkAction: TransactionTrackingActionDeeplink;

  constructor(private deeplinkService: DeeplinkService) {}

  public navigate(): void {
    if (this.deeplinkService.isAvailable(this.deeplinkAction.linkUrl)) {
      this.deeplinkService.navigate(this.deeplinkAction.linkUrl);
    } else {
      // TODO: Show modal when created		Date: 2021/12/01
      alert('This deeplink is not available');
    }
  }
}

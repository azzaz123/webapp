import { Component, Input } from '@angular/core';
import { TransactionTrackingActionCarrierTrackingWebview } from '@api/core/model/delivery/transaction/tracking';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';

@Component({
  selector: 'tsl-transaction-tracking-action-tracking-webview',
  templateUrl: './transaction-tracking-action-tracking-webview.component.html',
  styleUrls: ['./transaction-tracking-action-tracking-webview.component.scss'],
})
export class TransactionTrackingActionTrackingWebviewComponent {
  @Input() trackingWebviewAction: TransactionTrackingActionCarrierTrackingWebview;

  constructor(private deeplinkService: DeeplinkService) {}

  public navigate(): void {
    this.deeplinkService.navigate(this.trackingWebviewAction.linkUrl);
  }
}

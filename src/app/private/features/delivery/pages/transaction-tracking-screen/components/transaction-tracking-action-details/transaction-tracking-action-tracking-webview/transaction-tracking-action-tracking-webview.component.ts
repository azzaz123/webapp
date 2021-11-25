import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-transaction-tracking-action-tracking-webview',
  templateUrl: './transaction-tracking-action-tracking-webview.component.html',
  styleUrls: ['./transaction-tracking-action-tracking-webview.component.scss'],
})
export class TransactionTrackingActionTrackingWebviewComponent {
  @Input() trackingWebviewAction: any;

  constructor() {}
}

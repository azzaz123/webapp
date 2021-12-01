import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionTrackingWebviewComponent } from './transaction-tracking-action-tracking-webview.component';
import { DeeplinkServiceModule } from '@api/core/utils/deeplink/deeplink.module';

@NgModule({
  declarations: [TransactionTrackingActionTrackingWebviewComponent],
  imports: [CommonModule, DeeplinkServiceModule],
  exports: [TransactionTrackingActionTrackingWebviewComponent],
})
export class TransactionTrackingActionTrackingWebviewModule {}

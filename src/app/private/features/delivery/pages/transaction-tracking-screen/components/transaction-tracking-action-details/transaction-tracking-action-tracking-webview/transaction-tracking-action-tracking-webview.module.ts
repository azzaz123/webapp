import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionTrackingWebviewComponent } from './transaction-tracking-action-tracking-webview.component';
import { DeeplinkService } from '@api/core/utils/deeplink/deeplink.service';

@NgModule({
  declarations: [TransactionTrackingActionTrackingWebviewComponent],
  imports: [CommonModule],
  exports: [TransactionTrackingActionTrackingWebviewComponent],
  providers: [DeeplinkService],
})
export class TransactionTrackingActionTrackingWebviewModule {}

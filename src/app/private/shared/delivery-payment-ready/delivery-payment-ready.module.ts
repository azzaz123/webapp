import { NgModule } from '@angular/core';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { ConfirmPaymentModalModule } from './components/confirm-payment-modal/confirm-payment-modal.module';

@NgModule({
  imports: [WebViewModalModule, ConfirmPaymentModalModule],
})
export class DeliveryPaymentReadyModule {}

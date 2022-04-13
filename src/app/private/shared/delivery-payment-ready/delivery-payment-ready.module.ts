import { NgModule } from '@angular/core';
import { TransactionTrackingModule } from '@api/bff/delivery/transaction-tracking/transaction-tracking.module';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { ConfirmPaymentModalModule } from './components/confirm-payment-modal/confirm-payment-modal.module';
import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';

@NgModule({
  imports: [WebViewModalModule, TransactionTrackingModule, ConfirmPaymentModalModule],
  providers: [DeliveryPaymentReadyService],
})
export class DeliveryPaymentReadyModule {}

import { NgModule } from '@angular/core';
import { TransactionTrackingModule } from '@api/bff/delivery/transaction-tracking/transaction-tracking.module';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';
import { ContinueToPayPalModalModule } from './modules/continue-to-pay-pal/modals/continue-to-paypal/continue-to-paypal-modal.module';

@NgModule({
  imports: [WebViewModalModule, TransactionTrackingModule, ContinueToPayPalModalModule],
  providers: [DeliveryPaymentReadyService],
})
export class DeliveryPaymentReadyModule {}

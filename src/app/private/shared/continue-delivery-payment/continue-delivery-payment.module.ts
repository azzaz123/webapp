import { NgModule } from '@angular/core';
import { TransactionTrackingModule } from '@api/bff/delivery/transaction-tracking/transaction-tracking.module';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { ContinueDeliveryPaymentService } from './continue-delivery-payment.service';
import { ContinueToPayPalModule } from './modules/continue-to-pay-pal/continue-to-pay-pal.module';
import { ContinueWithCreditCardModule } from './modules/continue-with-credit-card/continue-with-credit-card.module';

@NgModule({
  imports: [WebViewModalModule, TransactionTrackingModule, ContinueToPayPalModule, ContinueWithCreditCardModule],
  providers: [ContinueDeliveryPaymentService],
})
export class ContinueDeliveryPaymentModule {}

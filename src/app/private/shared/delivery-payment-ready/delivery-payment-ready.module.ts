import { NgModule } from '@angular/core';
import { WebViewModalModule } from '@shared/web-view-modal/web-view-modal.module';
import { DeliveryPaymentReadyService } from './delivery-payment-ready.service';

@NgModule({
  imports: [WebViewModalModule],
  providers: [DeliveryPaymentReadyService],
})
export class DeliveryPaymentReadyModule {}

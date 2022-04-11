import { NgModule } from '@angular/core';

import { PaymentsPaymentMethodsHttpService } from '@api/payments/payment-methods/http/payments-payment-methods-http.service';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';

@NgModule({
  providers: [PaymentsPaymentMethodsService, PaymentsPaymentMethodsHttpService],
})
export class PaymentsPaymentMethodsModule {}

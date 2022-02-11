import { NgModule } from '@angular/core';

import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';
import { PaymentsUserPaymentPreferencesService } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.service';

@NgModule({
  providers: [PaymentsUserPaymentPreferencesService, PaymentsUserPaymentPreferencesHttpService],
})
export class PaymentsUserPaymentPreferencesModule {}

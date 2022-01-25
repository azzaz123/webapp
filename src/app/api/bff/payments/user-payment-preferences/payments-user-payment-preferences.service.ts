import { Injectable } from '@angular/core';

import { mapPaymentsUserPaymentPreferncesDtoToPaymentsUserPaymentPreferences } from '@api/bff/payments/user-payment-preferences/mappers/payments-user-payment-preferences.mapper';
import { PaymentsUserPaymentPreferences } from '@api/bff/payments/user-payment-preferences/interfaces/payments-user-payment-preferences.interface';
import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentsUserPaymentPreferencesService {
  constructor(private paymentUserPreferencesHttpService: PaymentsUserPaymentPreferencesHttpService) {}

  public get paymentUserPreferences(): Observable<PaymentsUserPaymentPreferences> {
    return this.paymentUserPreferencesHttpService
      .getUserPaymentPreferences()
      .pipe(map(mapPaymentsUserPaymentPreferncesDtoToPaymentsUserPaymentPreferences));
  }
}

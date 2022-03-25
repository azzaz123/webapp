import { Injectable } from '@angular/core';

import { PaymentsUserPaymentPreferences } from '@api/core/model/payments/interfaces/payments-user-payment-preferences.interface';
import { mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences } from './mappers/responses/payments-user-payment-preferences.mapper';
import { PaymentsUserPaymentPreferencesHttpService } from '@api/bff/payments/user-payment-preferences/http/payments-user-payment-preferences-http.service';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PaymentsUserPaymentPreferencesUpdateDto } from './dtos/requests/payments-user-payment-preferences-update.interface';
import { mapUserPaymentsPreferencesToDto } from './mappers/requests/payments-user-payment-preferences-update.mapper';

@Injectable({
  providedIn: 'root',
})
export class PaymentsUserPaymentPreferencesService {
  constructor(private paymentUserPreferencesHttpService: PaymentsUserPaymentPreferencesHttpService) {}

  public get(): Observable<PaymentsUserPaymentPreferences> {
    return this.paymentUserPreferencesHttpService
      .getUserPaymentPreferences()
      .pipe(map(mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences));
  }

  public update(newPreferences: PaymentsUserPaymentPreferences): Observable<void> {
    const { id } = newPreferences.preferences;
    const preferencesDto: PaymentsUserPaymentPreferencesUpdateDto = mapUserPaymentsPreferencesToDto(newPreferences);
    return this.paymentUserPreferencesHttpService.update(id, preferencesDto);
  }
}

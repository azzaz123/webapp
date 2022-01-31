import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PaymentsUserPaymentPreferencesDto } from '@api/bff/payments/user-payment-preferences/dtos/payments-user-payment-preferences-dto.interface';
import { USER_PAYMENT_PREFERENCES_ENDPOINT } from '@api/bff/payments/user-payment-preferences/http/endpoints';

import { Observable } from 'rxjs';

@Injectable()
export class PaymentsUserPaymentPreferencesHttpService {
  constructor(private http: HttpClient) {}

  public getUserPaymentPreferences(): Observable<PaymentsUserPaymentPreferencesDto> {
    return this.http.get<PaymentsUserPaymentPreferencesDto>(USER_PAYMENT_PREFERENCES_ENDPOINT);
  }
}

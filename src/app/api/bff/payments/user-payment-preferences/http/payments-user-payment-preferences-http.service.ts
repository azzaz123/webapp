import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  USER_PAYMENT_PREFERENCES_ENDPOINT,
  USER_PAYMENT_PREFERENCES_UPDATE_ENDPOINT,
} from '@api/bff/payments/user-payment-preferences/http/endpoints';
import { PaymentsUserPaymentPreferences } from '@api/core/model/payments';

import { Observable } from 'rxjs';
import { PaymentsUserPaymentPreferencesDto } from '../dtos/responses/payments-user-payment-preferences-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentsUserPaymentPreferencesHttpService {
  constructor(private http: HttpClient) {}

  public getUserPaymentPreferences(): Observable<PaymentsUserPaymentPreferencesDto> {
    return this.http.get<PaymentsUserPaymentPreferencesDto>(USER_PAYMENT_PREFERENCES_ENDPOINT);
  }
}

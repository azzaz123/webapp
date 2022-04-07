import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BASE_PAYMENT_PREFERENCES_ENDPOINT,
  USER_PAYMENT_PREFERENCES_ENDPOINT,
  USER_PAYMENT_PREFERENCES_UPDATE_ENDPOINT,
} from '@api/bff/payments/user-payment-preferences/http/endpoints';
import { UuidService } from '@core/uuid/uuid.service';

import { Observable } from 'rxjs';
import { PaymentsUserPaymentPreferencesUpdateDto } from '../dtos/requests/payments-user-payment-preferences-update.interface';
import { PaymentsUserPaymentPreferencesDto } from '../dtos/responses/payments-user-payment-preferences-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentsUserPaymentPreferencesHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<PaymentsUserPaymentPreferencesDto> {
    return this.http.get<PaymentsUserPaymentPreferencesDto>(USER_PAYMENT_PREFERENCES_ENDPOINT);
  }

  public create(id: string, body: PaymentsUserPaymentPreferencesUpdateDto): Observable<void> {
    return this.http.post<void>(BASE_PAYMENT_PREFERENCES_ENDPOINT, { ...body, id });
  }

  public update(id: string, body: PaymentsUserPaymentPreferencesUpdateDto): Observable<void> {
    return this.http.put<void>(USER_PAYMENT_PREFERENCES_UPDATE_ENDPOINT(id), body);
  }
}

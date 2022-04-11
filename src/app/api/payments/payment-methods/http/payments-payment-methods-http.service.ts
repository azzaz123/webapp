import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PAYMENTS_PAYMENT_METHODS_ENDPOINT } from '@api/payments/payment-methods/http/endpoints';
import { PaymentsPaymentMethodsDto } from '@api/payments/payment-methods/dtos/payments-payment-methods-dto.interface';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentsPaymentMethodsHttpService {
  constructor(private http: HttpClient) {}

  public getPaymentMethods(): Observable<PaymentsPaymentMethodsDto> {
    return this.http.get<PaymentsPaymentMethodsDto>(PAYMENTS_PAYMENT_METHODS_ENDPOINT);
  }
}

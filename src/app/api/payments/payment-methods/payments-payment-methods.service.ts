import { Injectable } from '@angular/core';

import { mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods } from '@api/payments/payment-methods/mappers/payments-payment-methods.mapper';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsHttpService } from '@api/payments/payment-methods/http/payments-payment-methods-http.service';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentsPaymentMethodsService {
  constructor(private paymentMethodsHttpService: PaymentsPaymentMethodsHttpService) {}

  public get paymentMethods(): Observable<PaymentsPaymentMethods> {
    return this.paymentMethodsHttpService.getPaymentMethods().pipe(map(mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods));
  }
}

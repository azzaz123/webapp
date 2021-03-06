import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import {
  MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE,
  MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ALL_PAYMENT_METHODS,
} from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { PaymentsPaymentMethods } from '@api/core/model/payments/interfaces/payments-payment-methods.interface';
import { PaymentsPaymentMethodsHttpService } from '@api/payments/payment-methods/http/payments-payment-methods-http.service';
import { PaymentsPaymentMethodsService } from '@api/payments/payment-methods/payments-payment-methods.service';

import { of } from 'rxjs';

describe('PaymentsPaymentMethodsService', () => {
  let service: PaymentsPaymentMethodsService;
  let paymentMethodsHttpService: PaymentsPaymentMethodsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentsPaymentMethodsService, PaymentsPaymentMethodsHttpService],
    });
    service = TestBed.inject(PaymentsPaymentMethodsService);
    paymentMethodsHttpService = TestBed.inject(PaymentsPaymentMethodsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to get the user payment methods', () => {
    beforeEach(() => {
      spyOn(paymentMethodsHttpService, 'getPaymentMethods').and.returnValue(of(MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE));
    });

    it('should retrieve the user payment methods', () => {
      service.paymentMethods.subscribe();

      expect(paymentMethodsHttpService.getPaymentMethods).toHaveBeenCalledTimes(1);
    });

    it('should map server response to web context with only available payments methods', () => {
      let response: PaymentsPaymentMethods;

      service.paymentMethods.subscribe((data) => (response = data));

      expect(response).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ALL_PAYMENT_METHODS);
    });
  });
});

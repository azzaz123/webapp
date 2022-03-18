import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { MOCK_PAYMENTS_PAYMENT_METHODS } from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_PAYMENT_EVENT_TYPE } from '@private/features/payview/modules/payment/enums/payview-payment-event-type.enum';
import { PayviewPaymentService } from '@private/features/payview/modules/payment/services/payview-payment.service';

describe('PayviewPaymentService', () => {
  let service: PayviewPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayviewPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('WHEN set a payment method', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: PaymentsPaymentMethod;
      const expected = MOCK_PAYMENTS_PAYMENT_METHODS.paymentMethods[0];
      const subscription = service.on(PAYVIEW_PAYMENT_EVENT_TYPE.PAYMENT_METHOD_SELECTED, (paymentMethod: PaymentsPaymentMethod) => {
        subscription.unsubscribe();
        result = paymentMethod;
      });

      service.setPaymentMethod(expected);
      tick();

      expect(result).toStrictEqual(expected);
    }));
  });

  describe('WHEN edit the credit card', () => {
    it('should send a notification to subscribers', fakeAsync(() => {
      let result: number = 0;
      const expected: number = 1;
      const subscription = service.on(PAYVIEW_PAYMENT_EVENT_TYPE.OPEN_CREDIT_CARD, () => {
        subscription.unsubscribe();
        result++;
      });

      service.editCreditCard();
      tick();

      expect(result).toBe(expected);
    }));
  });
});

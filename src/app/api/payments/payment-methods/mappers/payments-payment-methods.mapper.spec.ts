import { mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods } from '@api/payments/payment-methods/mappers/payments-payment-methods.mapper';
import {
  MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE,
  MOCK_PAYMENTS_PAYMENT_METHODS,
} from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';

describe('mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods', () => {
  describe('when mapping from payment methods DTO', () => {
    it('should map to a payment methods entity', () => {
      const mappedUserPaymentPreferences = mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods(MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE);

      expect(mappedUserPaymentPreferences).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS);
    });
  });
});

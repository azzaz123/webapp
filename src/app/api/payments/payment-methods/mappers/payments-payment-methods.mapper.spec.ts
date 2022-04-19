import { mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods } from '@api/payments/payment-methods/mappers/payments-payment-methods.mapper';
import {
  MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ONLY_CREDIT_CARD,
  MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE_WITH_AVAILABLE_METHODS,
  MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE_WITH_NON_AVAILABLE_METHODS,
  MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ALL_PAYMENT_METHODS,
} from '@api/fixtures/payments/payment-methods/payments-payment-methods-dto.fixtures.spec';

describe('mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods', () => {
  describe('when mapping from payment methods DTO', () => {
    describe('and the payment methods are available', () => {
      it('should map and return all payment methods', () => {
        const mappedUserPaymentPreferences = mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods(
          MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE_WITH_AVAILABLE_METHODS
        );

        expect(mappedUserPaymentPreferences).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ALL_PAYMENT_METHODS);
      });
    });

    describe('and the payment methods are NOT available', () => {
      it('should return mapped only the available payment methods', () => {
        const mappedUserPaymentPreferences = mapPaymentsPaymentMethodsDtoToPaymentsPaymentMethods(
          MOCK_PAYMENTS_PAYMENT_METHODS_RESPONSE_WITH_NON_AVAILABLE_METHODS
        );

        expect(mappedUserPaymentPreferences).toEqual(MOCK_PAYMENTS_PAYMENT_METHODS_WITH_ONLY_CREDIT_CARD);
      });
    });
  });
});

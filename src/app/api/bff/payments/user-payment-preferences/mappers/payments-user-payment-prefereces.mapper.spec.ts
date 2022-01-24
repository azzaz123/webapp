import { mapPaymentsUserPaymentPreferncesDtoToPaymentsUserPaymentPreferences as mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences } from '@api/bff/payments/user-payment-preferences/mappers/payments-user-payment-preferences.mapper';
import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';

describe('mapPaymentsUserPaymentPreferncesDtoToPaymentsUserPaymentPreferences', () => {
  describe('when mapping from user payment preferences DTO', () => {
    it('should map to a user payment preferences entity', () => {
      const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
        MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE
      );
      expect(JSON.stringify(mappedUserPaymentPreferences)).toEqual(JSON.stringify(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES));
    });
  });
});

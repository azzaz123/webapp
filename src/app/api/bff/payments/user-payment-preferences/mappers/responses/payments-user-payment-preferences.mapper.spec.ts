import { mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences } from './payments-user-payment-preferences.mapper';
import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCE,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCE_RESPONSE,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';

describe('mapPaymentsUserPaymentPreferncesDtoToPaymentsUserPaymentPreferences', () => {
  describe('when mapping from user payment preferences DTO', () => {
    describe('and the user has preferences specified', () => {
      it('should map to a user payment preferences entity', () => {
        const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE
        );
        expect(mappedUserPaymentPreferences).toEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES);
      });
    });

    describe('and the user has NOT preferences specified', () => {
      it('should map to a user payment preferences entity', () => {
        const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCE_RESPONSE
        );
        expect(mappedUserPaymentPreferences).toEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCE);
      });
    });
  });
});

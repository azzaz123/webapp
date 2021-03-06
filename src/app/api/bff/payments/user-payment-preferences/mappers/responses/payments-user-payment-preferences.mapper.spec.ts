import { mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences } from './payments-user-payment-preferences.mapper';
import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE_WITH_NOT_AVAILABLE_DEFAULTS,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE_WITH_NOT_AVAILABLE_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PAYMENT_METHOD,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PAYMENT_METHOD_RESPONSE,
  MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCES_RESPONSE,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';

describe('mapPaymentsUserPaymentPreferncesDtoToPaymentsUserPaymentPreferences', () => {
  describe('when mapping from user payment preferences DTO', () => {
    describe('and the user has preferences specified', () => {
      describe('and the preferences and defaults are available', () => {
        it('should map to a user payment preferences entity', () => {
          const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
            MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE
          );
          expect(mappedUserPaymentPreferences).toStrictEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD);
        });
      });

      describe('and the preferences are NOT available', () => {
        it('should map to a user payment preference with an available preference', () => {
          const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
            MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE_WITH_NOT_AVAILABLE_PREFERENCES
          );
          expect(mappedUserPaymentPreferences).toStrictEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD);
        });
      });

      describe('and the defaults are NOT available', () => {
        it('should map to a user payment preference with an available defaults', () => {
          const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
            MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_RESPONSE_WITH_NOT_AVAILABLE_DEFAULTS
          );
          expect(mappedUserPaymentPreferences).toStrictEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD);
        });
      });
    });

    describe('and the user has NOT preferences specified', () => {
      it('should map to a default user payment preferences', () => {
        const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PREFERENCES_RESPONSE
        );
        const mappedPreferences = mappedUserPaymentPreferences.preferences;

        expect(mappedUserPaymentPreferences.defaults).toStrictEqual(
          MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD.defaults
        );
        expect(mappedPreferences.id).toBeDefined();
        expect(mappedPreferences.isNewBuyer).toStrictEqual(true);
        expect(mappedPreferences.paymentMethod).toStrictEqual(
          MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD.defaults.paymentMethod
        );
        expect(mappedPreferences.useWallet).toStrictEqual(
          MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD.defaults.useWallet
        );
        expect(mappedPreferences.walletBlocked).toStrictEqual(
          MOCK_PAYMENTS_NEW_USER_PAYMENT_PREFERENCES_WITH_ONLY_CREDIT_CARD.defaults.walletBlocked
        );
      });
    });

    describe('and the user has NOT payment method specified', () => {
      it('should map to a user payment preferences entity', () => {
        const mappedUserPaymentPreferences = mapPaymentsUserPaymentPreferencesDtoToPaymentsUserPaymentPreferences(
          MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PAYMENT_METHOD_RESPONSE
        );
        expect(mappedUserPaymentPreferences).toStrictEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_WITHOUT_PAYMENT_METHOD);
      });
    });
  });
});

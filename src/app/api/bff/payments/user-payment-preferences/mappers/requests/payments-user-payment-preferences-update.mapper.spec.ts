import {
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES,
  MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_UPDATE_REQUEST,
} from '@api/fixtures/bff/payments/user-payment-preferences/payments-user-payment-preferences-dto.fixtures.spec';
import { PaymentsUserPaymentPreferencesUpdateDto } from '../../dtos/requests/payments-user-payment-preferences-update.interface';
import { mapUserPaymentsPreferencesToDto } from './payments-user-payment-preferences-update.mapper';

describe('mapUserPaymentsPreferencesToDto', () => {
  describe('when mapping from user payment preferences to update DTO', () => {
    it('should map to update DTO request', () => {
      const mappedUserPaymentPreferencesUpdate: PaymentsUserPaymentPreferencesUpdateDto = mapUserPaymentsPreferencesToDto(
        MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES
      );
      expect(mappedUserPaymentPreferencesUpdate).toEqual(MOCK_PAYMENTS_USER_PAYMENT_PREFERENCES_UPDATE_REQUEST);
    });
  });
});

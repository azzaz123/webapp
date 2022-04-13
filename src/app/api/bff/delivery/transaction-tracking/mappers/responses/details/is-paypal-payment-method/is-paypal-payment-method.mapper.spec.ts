import {
  MOCK_TRANSACTION_TRACKING_DETAILS,
  MOCK_TRANSACTION_TRACKING_DETAILS_WITH_PAYPAL,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { mapTransactionTrackingDescriptionToIsPayPalPaymentMethod } from './is-paypal-payment-method.mapper';

describe('mapTransactionTrackingDescriptionToIsPayPalPaymentMethod', () => {
  describe('when details notify that payment method was done with PayPal', () => {
    it('should notify as it was done with PayPal', () => {
      const isPayPal: boolean = mapTransactionTrackingDescriptionToIsPayPalPaymentMethod(MOCK_TRANSACTION_TRACKING_DETAILS_WITH_PAYPAL);

      expect(isPayPal).toBe(true);
    });
  });

  describe('when details notify that payment method was done without PayPal', () => {
    it('should notify it was NOT done with PayPal', () => {
      const isPayPal: boolean = mapTransactionTrackingDescriptionToIsPayPalPaymentMethod(MOCK_TRANSACTION_TRACKING_DETAILS);

      expect(isPayPal).toBe(false);
    });
  });
});

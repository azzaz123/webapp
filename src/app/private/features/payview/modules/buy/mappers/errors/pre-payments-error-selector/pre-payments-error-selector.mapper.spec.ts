import {
  EmptyBuyerAddressError,
  EmptyPostOfficeAddressError,
  EmptyPostOfficeReturnAddressError,
  NoDeliveryMethodSelectedError,
  NoPaymentSelectedError,
  PaymentInfoMissingError,
  PrePaymentUnknownError,
} from '@api/core/errors/delivery/payview/pre-payment';
import {
  MOCK_PAYVIEW_STATE_DOPO_WITHOUT_LASTADDRESSUSED,
  MOCK_PAYVIEW_STATE_WITHOUT_SELECTED_CARRIER,
  MOCK_PAYVIEW_STATE_DOPO_WITHOUT_DELIVERY_ADDRESS,
  MOCK_PAYVIEW_STATE_WITH_CREDIT_CARD_PREFERENCE,
  MOCK_PAYVIEW_STATE_BUYER_ADDRESS_WITHOUT_LAST_ADDRESS,
  MOCK_PAYVIEW_STATE_WITHOUT_SELECTED_PAYMENT,
} from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { prePaymentsErrorSelector } from './pre-payments-error-selector.mapper';

describe('when we are checking pre payments errors before buying a product', () => {
  describe('and the payview state is not provided', () => {
    it('should return an unknown error', () => {
      const result: PrePaymentUnknownError = prePaymentsErrorSelector(null);

      expect(result instanceof PrePaymentUnknownError).toBe(true);
    });
  });

  describe(`and the user doesn't have a selected carrier`, () => {
    it('should return a no delivery method selected error', () => {
      const result: NoDeliveryMethodSelectedError = prePaymentsErrorSelector(MOCK_PAYVIEW_STATE_WITHOUT_SELECTED_CARRIER);

      expect(result instanceof NoDeliveryMethodSelectedError).toBe(true);
    });
  });

  describe(`and the user selected HPU delivery and doesn't have delivery address`, () => {
    it('should return a empty buyer address error', () => {
      const result: EmptyBuyerAddressError = prePaymentsErrorSelector(MOCK_PAYVIEW_STATE_BUYER_ADDRESS_WITHOUT_LAST_ADDRESS);

      expect(result instanceof EmptyBuyerAddressError).toBe(true);
    });
  });

  describe(`and the user selected DOPO delivery and don't selected post office `, () => {
    it('should return a empty post office address error', () => {
      const result: EmptyPostOfficeAddressError = prePaymentsErrorSelector(MOCK_PAYVIEW_STATE_DOPO_WITHOUT_LASTADDRESSUSED);

      expect(result instanceof EmptyPostOfficeAddressError).toBe(true);
    });
  });

  describe(`and the user selected DOPO and don't have delivery address`, () => {
    it('should return a empty post office return address error', () => {
      const result: EmptyPostOfficeReturnAddressError = prePaymentsErrorSelector(MOCK_PAYVIEW_STATE_DOPO_WITHOUT_DELIVERY_ADDRESS);

      expect(result instanceof EmptyPostOfficeReturnAddressError).toBe(true);
    });
  });

  describe(`and the user don't have any payment method selected`, () => {
    it('should return a no payment selected error', () => {
      const result: NoPaymentSelectedError = prePaymentsErrorSelector(MOCK_PAYVIEW_STATE_WITHOUT_SELECTED_PAYMENT);

      expect(result instanceof NoPaymentSelectedError).toBe(true);
    });
  });

  describe('and the selected payment method is an empty card', () => {
    it('should return a payment info missing error', () => {
      const result: PaymentInfoMissingError = prePaymentsErrorSelector(MOCK_PAYVIEW_STATE_WITH_CREDIT_CARD_PREFERENCE);

      expect(result instanceof PaymentInfoMissingError).toBe(true);
    });
  });
});

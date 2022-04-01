import { NoCarrierOfficeAddressForUserError } from '@api/core/errors/delivery/payview/buyer-requests/no-carrier-office-address-for-user.error';
import { BuyRequestErrorMapper } from './buy-request-error-mapper';
import {
  AlreadyUsedPromocodeError,
  BlockedBuyerError,
  BlockedSellerError,
  BuyerRequestsError,
  CarrierOfficeAddressAndHomeAddressCountriesDoNotMatchError,
  CurrencyNotAcceptedError,
  DuplicatedRequestError,
  ExpiredPromocodeError,
  InternationalShippingNotEnabledForUserError,
  ItemCategoryDifferentToPromocodeItemCategoryError,
  ItemMaxWeightGreaterThanPromocodeMaxWeightError,
  ItemPriceSmallerThankPromocodeMinPriceError,
  MaxRequestNumberExceededError,
  NoAddressForUserError,
  NotActiveYetPromocodeError,
  NotExistingPromocodeError,
  UserHasNoCardError,
  AlreadyInProgressTransactionError,
  NonPurchasableItemError,
  NotShippableItemError,
  PostalCodeTemporarilyRestrictedError,
} from '@api/core/errors/delivery/payview/buyer-requests';
import {
  MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE,
  MOCK_DUPLICATED_REQUEST_ERROR_RESPONSE,
  MOCK_NO_ADDRESS_FOR_USER_ERROR_RESPONSE,
  MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE,
} from '@fixtures/private/delivery/payview/buy-request-errors.fixtures.spec';

const buyRequestErrorMapper = new BuyRequestErrorMapper();

describe('when we receive an error from backend when we are trying to buy an item', () => {
  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NO_ADDRESS_FOR_USER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NoAddressForUserError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NoCarrierOfficeAddressForUserError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof AlreadyInProgressTransactionError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_DUPLICATED_REQUEST_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof DuplicatedRequestError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NonPurchasableItemError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof BlockedSellerError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof BlockedBuyerError).toBe(true);
    });
  });
  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof UserHasNoCardError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof CurrencyNotAcceptedError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof MaxRequestNumberExceededError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof AlreadyUsedPromocodeError).toBe(true);
    });
  });
  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ExpiredPromocodeError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ItemCategoryDifferentToPromocodeItemCategoryError).toBe(true);
    });
  });
  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ItemMaxWeightGreaterThanPromocodeMaxWeightError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ItemPriceSmallerThankPromocodeMinPriceError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotActiveYetPromocodeError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotExistingPromocodeError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PostalCodeTemporarilyRestrictedError).toBe(true);
    });
  });

  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotShippableItemError).toBe(true);
    });
  });
  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof InternationalShippingNotEnabledForUserError).toBe(true);
    });
  });
  describe('', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(null).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof CarrierOfficeAddressAndHomeAddressCountriesDoNotMatchError).toBe(true);
    });
  });
});

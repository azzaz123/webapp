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
  ItemPriceSmallerThanPromocodeMinPriceError,
  MaxRequestNumberExceededError,
  NoAddressForUserError,
  NotActiveYetPromocodeError,
  NotExistingPromocodeError,
  InvalidCardError,
  AlreadyInProgressTransactionError,
  NonPurchasableItemError,
  NotShippableItemError,
  PostalCodeTemporarilyRestrictedError,
} from '@api/core/errors/delivery/payview/buyer-requests';
import {
  MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE,
  MOCK_ALREADY_USED_PROMOCODE_ERROR_RESPONSE,
  MOCK_BLOCKED_BUYER_ERROR_RESPONSE,
  MOCK_BLOCKED_SELLER_ERROR_RESPONSE,
  MOCK_CARRIER_OFFICE_ADDRESS_AND_HOME_ADDRESS_COUNTRIES_DO_NOT_MATCH_ERROR_RESPONSE,
  MOCK_CURRENCY_NOT_ACCEPTED_ERROR_RESPONSE,
  MOCK_DUPLICATED_REQUEST_ERROR_RESPONSE,
  MOCK_EXPIRED_PROMOCODE_ERROR_RESPONSE,
  MOCK_INTERNATIONAL_SHIPPING_NOT_ENABLED_FOR_USER_ERROR_RESPONSE,
  MOCK_ITEM_CATEGORY_DIFFERENT_TO_PROMOCODE_ITEM_CATEGORY_ERROR_RESPONSE,
  MOCK_ITEM_MAX_WEIGHT_GREATER_THAN_PROMOCODE_MAX_WEIGHT_ERROR_RESPONSE,
  MOCK_ITEM_PRICE_SMALLER_THAN_PROMOCODE_MIN_PRICE_ERROR_RESPONSE,
  MOCK_MAX_REQUEST_NUMBER_EXCEEDED_ERROR_RESPONSE,
  MOCK_NON_PURCHASABLE_ITEM_ERROR_RESPONSE,
  MOCK_NOT_ACTIVE_YET_PROMOCODE_ERROR_RESPONSE,
  MOCK_NOT_EXISTING_PROMOCODE_ERROR_RESPONSE,
  MOCK_NOT_SHIPPABLE_ITEM_ERROR_RESPONSE,
  MOCK_NO_ADDRESS_FOR_USER_ERROR_RESPONSE,
  MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE,
  MOCK_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR_RESPONSE,
  MOCK_INVALID_CARD_ERROR_RESPONSE,
} from '@fixtures/private/delivery/payview/buy-request-errors.fixtures.spec';

const buyRequestErrorMapper = new BuyRequestErrorMapper();

describe('when we receive an error from backend when we are trying to buy an item', () => {
  describe('when server notifies user does not have address', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NO_ADDRESS_FOR_USER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NoAddressForUserError).toBe(true);
    });
  });

  describe('when server notifies user does not have a carrier office address', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NO_CARRIER_OFFICE_ADDRESS_FOR_USER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NoCarrierOfficeAddressForUserError).toBe(true);
    });
  });

  describe('when server notifies already in progress transaction', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof AlreadyInProgressTransactionError).toBe(true);
    });
  });

  describe('when server notifies duplicated request', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_DUPLICATED_REQUEST_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof DuplicatedRequestError).toBe(true);
    });
  });

  describe('when server notifies non purchasable item', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NON_PURCHASABLE_ITEM_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NonPurchasableItemError).toBe(true);
    });
  });

  describe('when server notifies seller blocked by buyer', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_BLOCKED_SELLER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof BlockedSellerError).toBe(true);
    });
  });

  describe('when server notifies buyer blocked by seller', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_BLOCKED_BUYER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof BlockedBuyerError).toBe(true);
    });
  });

  describe('when server notifies invalid card', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_INVALID_CARD_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof InvalidCardError).toBe(true);
    });
  });

  describe('when server notifies currency not accepted', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_CURRENCY_NOT_ACCEPTED_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof CurrencyNotAcceptedError).toBe(true);
    });
  });

  describe('when server notifies transaction number exceeded', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_MAX_REQUEST_NUMBER_EXCEEDED_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof MaxRequestNumberExceededError).toBe(true);
    });
  });

  describe('when server notifies promocode already used', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_ALREADY_USED_PROMOCODE_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof AlreadyUsedPromocodeError).toBe(true);
    });
  });
  describe('when server notifies promocode expired', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_EXPIRED_PROMOCODE_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ExpiredPromocodeError).toBe(true);
    });
  });

  describe('when server notifies item category different to promocode item category', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_ITEM_CATEGORY_DIFFERENT_TO_PROMOCODE_ITEM_CATEGORY_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ItemCategoryDifferentToPromocodeItemCategoryError).toBe(true);
    });
  });
  describe('when server notifies item max weight greater than promocode max weight', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_ITEM_MAX_WEIGHT_GREATER_THAN_PROMOCODE_MAX_WEIGHT_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ItemMaxWeightGreaterThanPromocodeMaxWeightError).toBe(true);
    });
  });

  describe('when server notifies item price smaller than promocode min price', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_ITEM_PRICE_SMALLER_THAN_PROMOCODE_MIN_PRICE_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof ItemPriceSmallerThanPromocodeMinPriceError).toBe(true);
    });
  });

  describe('when server notifies promocode not active yet', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NOT_ACTIVE_YET_PROMOCODE_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotActiveYetPromocodeError).toBe(true);
    });
  });

  describe('when server notifies promocode does not exist', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NOT_EXISTING_PROMOCODE_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotExistingPromocodeError).toBe(true);
    });
  });

  describe('when server notifies postal code temporarily restricted', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PostalCodeTemporarilyRestrictedError).toBe(true);
    });
  });

  describe('when server notifies not shippable item', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_NOT_SHIPPABLE_ITEM_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotShippableItemError).toBe(true);
    });
  });

  describe('when server notifies international shipping is not enabled for user', () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_INTERNATIONAL_SHIPPING_NOT_ENABLED_FOR_USER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof InternationalShippingNotEnabledForUserError).toBe(true);
    });
  });

  describe(`when server notifies carrier office address and home address countries don't match`, () => {
    it('should map the error to the correct domain instance', () => {
      let result: BuyerRequestsError;

      buyRequestErrorMapper.map(MOCK_CARRIER_OFFICE_ADDRESS_AND_HOME_ADDRESS_COUNTRIES_DO_NOT_MATCH_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof CarrierOfficeAddressAndHomeAddressCountriesDoNotMatchError).toBe(true);
    });
  });
});

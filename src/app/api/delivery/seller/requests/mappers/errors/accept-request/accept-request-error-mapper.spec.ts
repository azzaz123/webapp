import {
  AcceptRequestError,
  AlreadyInProgressTransactionError,
  BuyerBlockedBySellerError,
  BuyerBlockForFraudError,
  CarrierAddressesDontMatchError,
  InvalidCardError,
  IsNotPendingRequestError,
  NonPurchasableItemError,
  NotShippableItemError,
  PostalCodeNotAllowedError,
  PostalCodeNotFoundError,
  PostalCodeTemporarilyRestrictedError,
  RequestNotFoundError,
  SellerAddressNotAllowedError,
  SellerAddressNotFoundError,
  SellerBlockedByBuyerError,
  SellerBlockForFraudError,
} from '@api/core/errors/delivery/accept-screen/accept-request';
import {
  MOCK_ACCEPT_SCREEN_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_BUYER_BLOCKED_BY_SELLER_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_BUYER_BLOCK_FOR_FRAUD_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_CARRIER_ADDRESSES_DONT_MATCH_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_INVALID_CARD_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_IS_NOT_PENDING_REQUEST_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_NOT_SHIPPABLE_ITEM_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_ALLOWED_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_REQUEST_NOT_FOUND_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_ALLOWED_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_FOUND_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_SELLER_BLOCKED_BY_BUYER_ERROR_RESPONSE,
  MOCK_ACCEPT_SCREEN_SELLER_BLOCK_FOR_FRAUD_ERROR_RESPONSE,
} from '@fixtures/private/delivery/accept-screen/accept-screen-errors.fixtures.spec';
import { AcceptRequestErrorMapper } from './accept-request-error-mapper';

const acceptRequestErrorMapper = new AcceptRequestErrorMapper();

describe('when we receive an error from backend when we are accepting a request', () => {
  describe('and the error is because the item is not purchasable', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_NON_PURCHASABLE_ITEM_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NonPurchasableItemError).toBe(true);
    });
  });

  describe('and the error is because the seller address is not found', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_FOUND_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof SellerAddressNotFoundError).toBe(true);
    });
  });

  describe('and the error is because it is already an in progress transaction', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_ALREADY_IN_PROGRESS_TRANSACTION_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof AlreadyInProgressTransactionError).toBe(true);
    });
  });

  describe('and the error is because the seller was blocked for fraud', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_SELLER_BLOCK_FOR_FRAUD_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof SellerBlockForFraudError).toBe(true);
    });
  });

  describe('and the error is because the buyer was blocked for fraud', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_BUYER_BLOCK_FOR_FRAUD_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof BuyerBlockForFraudError).toBe(true);
    });
  });

  describe('and the error is because the payment card is invalid', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_INVALID_CARD_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof InvalidCardError).toBe(true);
    });
  });

  describe('and the error is because the seller was blocked by the buyer', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_SELLER_BLOCKED_BY_BUYER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof SellerBlockedByBuyerError).toBe(true);
    });
  });

  describe('and the error is because the buyer was blocked by the seller', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_BUYER_BLOCKED_BY_SELLER_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof BuyerBlockedBySellerError).toBe(true);
    });
  });

  describe('and the error is because the seller address was not allowed', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_SELLER_ADDRESS_NOT_ALLOWED_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof SellerAddressNotAllowedError).toBe(true);
    });
  });

  describe('and the error is because request was not found', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_REQUEST_NOT_FOUND_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof RequestNotFoundError).toBe(true);
    });
  });

  describe('and the error is because postal code was not found', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_FOUND_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PostalCodeNotFoundError).toBe(true);
    });
  });

  describe('and the error is because the postal code was not allowed', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_POSTAL_CODE_NOT_ALLOWED_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PostalCodeNotAllowedError).toBe(true);
    });
  });

  describe('and the error is because the postal code was temporarily restricted', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_POSTAL_CODE_TEMPORARILY_RESTRICTED_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof PostalCodeTemporarilyRestrictedError).toBe(true);
    });
  });

  describe('and the error is because the request is not pending', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_IS_NOT_PENDING_REQUEST_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof IsNotPendingRequestError).toBe(true);
    });
  });

  describe(`and the error is because the carrier addresses don't match`, () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_CARRIER_ADDRESSES_DONT_MATCH_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof CarrierAddressesDontMatchError).toBe(true);
    });
  });

  describe('and the error is because the item was not shippable', () => {
    it('should map the error to the correct domain instance', () => {
      let result: AcceptRequestError;

      acceptRequestErrorMapper.map(MOCK_ACCEPT_SCREEN_NOT_SHIPPABLE_ITEM_ERROR_RESPONSE).subscribe({
        error: (errors) => (result = errors[0]),
      });

      expect(result instanceof NotShippableItemError).toBe(true);
    });
  });
});

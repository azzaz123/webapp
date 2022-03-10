import {
  NonPurchasableItemError,
  AcceptRequestError,
  SellerAddressNotFoundError,
  AlreadyInProgressTransactionError,
  SellerBlockForFraudError,
  BuyerBlockForFraudError,
  InvalidCardError,
  SellerBlockedByBuyerError,
  BuyerBlockedBySellerError,
  SellerAddressNotAllowedError,
  RequestNotFoundError,
  PostalCodeNotFoundError,
  PostalCodeNotAllowedError,
  PostalCodeTemporarilyRestrictedError,
  IsNotPendingRequestError,
  CarrierAddressesDontMatchError,
  NotShippableItemError,
} from '@api/core/errors/delivery/accept-screen/accept-request';
import { ErrorMapper } from '@api/core/utils/classes';
import { AcceptRequestErrorResponse, AcceptRequestErrorDto } from '../../../dtos/errors';
import { ACCEPT_REQUEST_ERROR_CODES } from './accept-request-error-codes.enum';

export class AcceptRequestErrorMapper extends ErrorMapper<AcceptRequestErrorResponse> {
  protected generateErrorByRequest(networkError: AcceptRequestErrorResponse): AcceptRequestError[] {
    return networkError.error.map(this.mapAcceptRequestErrorResponse);
  }

  private mapAcceptRequestErrorResponse(error: AcceptRequestErrorDto): AcceptRequestError {
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.NON_PURCHASABLE_ITEM) {
      return new NonPurchasableItemError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_ADDRESS_NOT_FOUND) {
      return new SellerAddressNotFoundError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.ALREADY_IN_PROGRESS_TRANSACTION) {
      return new AlreadyInProgressTransactionError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_BLOCK_FOR_FRAUD) {
      return new SellerBlockForFraudError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.BUYER_BLOCK_FOR_FRAUD) {
      return new BuyerBlockForFraudError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.INVALID_CARD) {
      return new InvalidCardError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_BLOCKED_BY_BUYER) {
      return new SellerBlockedByBuyerError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.BUYER_BLOCKED_BY_SELLER) {
      return new BuyerBlockedBySellerError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_ADDRESS_NOT_ALLOWED) {
      return new SellerAddressNotAllowedError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.REQUEST_NOT_FOUND) {
      return new RequestNotFoundError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_NOT_FOUND) {
      return new PostalCodeNotFoundError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_NOT_ALLOWED) {
      return new PostalCodeNotAllowedError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_TEMPORARILY_RESTRICTED) {
      return new PostalCodeTemporarilyRestrictedError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.IS_NOT_PENDING_REQUEST) {
      return new IsNotPendingRequestError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.CARRIER_ADDRESSES_DONT_MATCH) {
      return new CarrierAddressesDontMatchError();
    }
    if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.NOT_SHIPPABLE_ITEM) {
      return new NotShippableItemError();
    }
  }
}

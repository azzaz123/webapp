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
    return this.mapAcceptRequestErrorResponse(networkError);
  }

  private mapAcceptRequestErrorResponse(networkError: AcceptRequestErrorResponse): AcceptRequestError[] {
    const mappedErrors: AcceptRequestError[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error: AcceptRequestErrorDto) => {
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.NON_PURCHASABLE_ITEM) {
        return mappedErrors.push(new NonPurchasableItemError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_ADDRESS_NOT_FOUND) {
        return mappedErrors.push(new SellerAddressNotFoundError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.ALREADY_IN_PROGRESS_TRANSACTION) {
        return mappedErrors.push(new AlreadyInProgressTransactionError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_BLOCK_FOR_FRAUD) {
        return mappedErrors.push(new SellerBlockForFraudError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.BUYER_BLOCK_FOR_FRAUD) {
        return mappedErrors.push(new BuyerBlockForFraudError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.INVALID_CARD) {
        return mappedErrors.push(new InvalidCardError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_BLOCKED_BY_BUYER) {
        return mappedErrors.push(new SellerBlockedByBuyerError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.BUYER_BLOCKED_BY_SELLER) {
        return mappedErrors.push(new BuyerBlockedBySellerError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.SELLER_ADDRESS_NOT_ALLOWED) {
        return mappedErrors.push(new SellerAddressNotAllowedError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.REQUEST_NOT_FOUND) {
        return mappedErrors.push(new RequestNotFoundError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_NOT_FOUND) {
        return mappedErrors.push(new PostalCodeNotFoundError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_NOT_ALLOWED) {
        return mappedErrors.push(new PostalCodeNotAllowedError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.POSTAL_CODE_TEMPORARILY_RESTRICTED) {
        return mappedErrors.push(new PostalCodeTemporarilyRestrictedError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.IS_NOT_PENDING_REQUEST) {
        return mappedErrors.push(new IsNotPendingRequestError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.CARRIER_ADDRESSES_DONT_MATCH) {
        return mappedErrors.push(new CarrierAddressesDontMatchError());
      }
      if (error.error_code === ACCEPT_REQUEST_ERROR_CODES.NOT_SHIPPABLE_ITEM) {
        return mappedErrors.push(new NotShippableItemError());
      }
    });

    return mappedErrors;
  }
}

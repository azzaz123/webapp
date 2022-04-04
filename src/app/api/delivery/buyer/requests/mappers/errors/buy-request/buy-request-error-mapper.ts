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
import { NoCarrierOfficeAddressForUserError } from '@api/core/errors/delivery/payview/buyer-requests/no-carrier-office-address-for-user.error';
import { ErrorMapper } from '@api/core/utils/classes';
import { BuyRequestErrorDto, BuyRequestErrorResponse } from '../../../dtos/errors';
import { BUY_REQUEST_ERROR_CODES } from './buy-request-error-codes.enum';

export class BuyRequestErrorMapper extends ErrorMapper<BuyRequestErrorResponse> {
  protected generateErrorByRequest(networkError: BuyRequestErrorResponse): BuyerRequestsError[] {
    return networkError.error.map(this.mapBuyRequestErrorResponse);
  }

  private mapBuyRequestErrorResponse(error: BuyRequestErrorDto): BuyerRequestsError {
    if (error.error_code === BUY_REQUEST_ERROR_CODES.NO_ADDRESS_FOR_USER) {
      return new NoAddressForUserError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.NO_CARRIER_OFFICE_ADDRESS_FOR_USER) {
      return new NoCarrierOfficeAddressForUserError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.ALREADY_IN_PROGRESS_TRANSACTION) {
      return new AlreadyInProgressTransactionError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.DUPLICATED_REQUEST) {
      return new DuplicatedRequestError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.NON_PURCHASABLE_ITEM) {
      return new NonPurchasableItemError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.BLOCKED_SELLER) {
      return new BlockedSellerError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.BLOCKED_BUYER) {
      return new BlockedBuyerError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.INVALID_CARD) {
      return new InvalidCardError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.CURRENCY_NOT_ACCEPTED) {
      return new CurrencyNotAcceptedError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.MAX_REQUEST_NUMBER_EXCEEDED) {
      return new MaxRequestNumberExceededError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.ALREADY_USED_PROMOCODE) {
      return new AlreadyUsedPromocodeError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.EXPIRED_PROMOCODE) {
      return new ExpiredPromocodeError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.ITEM_CATEGORY_DIFFERENT_TO_PROMOCODE_ITEM_CATEGORY) {
      return new ItemCategoryDifferentToPromocodeItemCategoryError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.ITEM_MAX_WEIGHT_GREATER_THAN_PROMOCODE_MAX_WEIGHT) {
      return new ItemMaxWeightGreaterThanPromocodeMaxWeightError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.ITEM_PRICE_SMALLER_THAN_PROMOCODE_MIN_PRICE) {
      return new ItemPriceSmallerThanPromocodeMinPriceError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.NOT_ACTIVE_YET_PROMOCODE) {
      return new NotActiveYetPromocodeError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.NOT_EXISTING_PROMOCODE) {
      return new NotExistingPromocodeError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.POSTAL_CODE_TEMPORARILY_RESTRICTED) {
      return new PostalCodeTemporarilyRestrictedError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.NOT_SHIPPABLE_ITEM) {
      return new NotShippableItemError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.INTERNATIONAL_SHIPPING_NOT_ENABLED_FOR_USER) {
      return new InternationalShippingNotEnabledForUserError();
    }
    if (error.error_code === BUY_REQUEST_ERROR_CODES.CARRIER_OFFICE_ADDRESS_AND_HOME_ADDRESS_COUNTRIES_DO_NOT_MATCH) {
      return new CarrierOfficeAddressAndHomeAddressCountriesDoNotMatchError();
    }
  }
}

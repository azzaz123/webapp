import {
  PhoneNumberIsInvalidError,
  MobilePhoneNumberIsInvalidError,
  AddressTooLongError,
  FlatAndFloorTooLongError,
} from '../../classes/address';
import { UniqueAddressByUserError } from '../../classes/address/unique-address.error';
import { DeliveryErrorResponseApi } from '../../classes/delivery-error-response-api';
import { PostalCodeIsInvalidError, PostalCodeDoesNotExistError, PostalCodeIsNotAllowedError } from '../../classes/postal-codes';
import { ErrorMapper } from '@api/core/utils/classes';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';

export type DeliveryAddressErrorResponse = DeliveryErrorResponseApi<DELIVERY_ADDRESS_ERROR_CODES>;

export class DeliveryAddressErrorMapper extends ErrorMapper<DeliveryAddressErrorResponse> {
  protected generateErrorByRequest(networkError: DeliveryAddressErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER) {
        mappedErrors.push(new PhoneNumberIsInvalidError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_MOBILE_PHONE_NUMBER) {
        mappedErrors.push(new MobilePhoneNumberIsInvalidError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_POSTAL_CODE) {
        mappedErrors.push(new PostalCodeIsInvalidError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED) {
        mappedErrors.push(new PostalCodeIsNotAllowedError(error.message));
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXIST) {
        mappedErrors.push(new PostalCodeDoesNotExistError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.DELIVERY_ADDRESS_TOO_LONG) {
        mappedErrors.push(new AddressTooLongError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.FLAT_AND_FLOOR_TOO_LONG) {
        mappedErrors.push(new FlatAndFloorTooLongError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.UNIQUE_ADDRESS_BY_USER) {
        mappedErrors.push(new UniqueAddressByUserError(error.message));
      }
    });

    return mappedErrors;
  }
}

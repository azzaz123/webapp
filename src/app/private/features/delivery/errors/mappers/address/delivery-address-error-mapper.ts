import {
  InvalidPhoneNumberError,
  InvalidMobilePhoneNumberError,
  AddressTooLongError,
  FlatAndFloorTooLongError,
} from '../../classes/address';
import { DeliveryErrorResponseApi } from '../../classes/delivery-error-response-api';
import { ErrorMapper } from '../error-mapper';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';

export type DeliveryAddressErrorResponse = DeliveryErrorResponseApi<DELIVERY_ADDRESS_ERROR_CODES>;

export class DeliveryAddressErrorMapper extends ErrorMapper<DeliveryAddressErrorResponse> {
  protected generateErrorByRequest(networkError: DeliveryAddressErrorResponse): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER) {
        mappedErrors.push(new InvalidPhoneNumberError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_MOBILE_PHONE_NUMBER) {
        mappedErrors.push(new InvalidMobilePhoneNumberError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.DELIVERY_ADDRESS_TOO_LONG) {
        mappedErrors.push(new AddressTooLongError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.FLAT_AND_FLOOR_TOO_LONG) {
        mappedErrors.push(new FlatAndFloorTooLongError());
      }
    });

    return mappedErrors;
  }
}

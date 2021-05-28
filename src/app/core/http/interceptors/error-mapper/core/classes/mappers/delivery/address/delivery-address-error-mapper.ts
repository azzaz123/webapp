import { AddressTooLongError } from '../../../errors/delivery/address/address-too-long.error';
import { DELIVERY_ADDRESS_ERROR_CODES } from '../../../errors/delivery/address/delivery-address-error.enum';
import { DeliveryAddressError } from '../../../errors/delivery/address/delivery-address.error';
import { FlatAndFloorTooLongError } from '../../../errors/delivery/address/flat-and-floor-too-long.error';
import { InvalidMobilePhoneNumber } from '../../../errors/delivery/address/invalid-mobile-phone-number.error';
import { InvalidPhoneNumberError } from '../../../errors/delivery/address/invalid-phone-number.error';
import { DeliveryErrorApi } from '../../../errors/delivery/delivery-api.error';
import { ErrorMapper } from '../../error-mapper';

export class DeliveryAddressErrorMapper extends ErrorMapper {
  protected generateErrorByRequest(networkError: DeliveryErrorApi<DeliveryAddressError>): Error[] {
    const mappedErrors: Error[] = [];
    const { error: backendDeliveryErrors } = networkError;

    backendDeliveryErrors.forEach((error) => {
      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER) {
        mappedErrors.push(new InvalidPhoneNumberError());
      }

      if (error.error_code === DELIVERY_ADDRESS_ERROR_CODES.INVALID_MOBILE_PHONE_NUMBER) {
        mappedErrors.push(new InvalidMobilePhoneNumber());
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

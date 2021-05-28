import { DeliveryAddressErrorTranslations } from '../../../../constants/delivery-error-translations';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';
import { DeliveryAddressError } from './delivery-address.error';

export class AddressTooLongError extends DeliveryAddressError {
  constructor() {
    super(DELIVERY_ADDRESS_ERROR_CODES.DELIVERY_ADDRESS_TOO_LONG, DeliveryAddressErrorTranslations.TOO_LONG_HINT);
  }
}

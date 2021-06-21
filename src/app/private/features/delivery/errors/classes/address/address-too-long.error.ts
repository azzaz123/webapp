import { DeliveryAddressErrorTranslations } from '../../constants/delivery-error-translations';
import { DeliveryAddressError } from './delivery-address.error';

export class AddressTooLongError extends DeliveryAddressError {
  constructor() {
    super(DeliveryAddressErrorTranslations.ADDRESS_TOO_LONG_HINT);
  }
}

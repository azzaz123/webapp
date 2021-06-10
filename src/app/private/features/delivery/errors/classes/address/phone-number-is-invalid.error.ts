import { DeliveryAddressErrorTranslations } from '../../constants/delivery-error-translations';
import { DeliveryAddressError } from './delivery-address.error';

export class PhoneNumberIsInvalidError extends DeliveryAddressError {
  constructor() {
    super(DeliveryAddressErrorTranslations.PHONE_NUMBER_INVALID);
  }
}

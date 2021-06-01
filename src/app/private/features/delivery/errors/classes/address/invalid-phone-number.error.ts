import { DeliveryAddressErrorTranslations } from '../../constants/delivery-error-translations';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';
import { DeliveryAddressError } from './delivery-address.error';

export class InvalidPhoneNumberError extends DeliveryAddressError {
  constructor() {
    super(DELIVERY_ADDRESS_ERROR_CODES.INVALID_PHONE_NUMBER, DeliveryAddressErrorTranslations.PHONE_NUMBER_INVALID);
  }
}

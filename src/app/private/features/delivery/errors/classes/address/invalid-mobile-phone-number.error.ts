import { DeliveryAddressErrorTranslations } from '../../constants/delivery-error-translations';
import { DeliveryAddressError } from './delivery-address.error';

export class InvalidMobilePhoneNumber extends DeliveryAddressError {
  constructor() {
    super(DeliveryAddressErrorTranslations.PHONE_MISSMATCH_LOCATION);
  }
}

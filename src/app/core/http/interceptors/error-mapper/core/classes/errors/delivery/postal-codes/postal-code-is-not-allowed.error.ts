import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorTranslations } from '../../../../constants/delivery-error-translations';

export class PostalCodeIsNotAllowed extends DeliveryPostalCodesError {
  constructor() {
    super(DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_IS_NOT_ALLOWED, DeliveryPostalCodesErrorTranslations.POSTAL_CODE_NOT_ALLOWED);
  }
}

import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorTranslations } from '../../../../constants/delivery-error-translations';

export class PostalCodeDoesNotExist extends DeliveryPostalCodesError {
  constructor() {
    super(DELIVERY_POSTAL_CODES_ERROR_CODES.POSTAL_CODE_DOES_NOT_EXISTS, DeliveryPostalCodesErrorTranslations.POSTAL_CODE_DOES_NOT_EXIST);
  }
}

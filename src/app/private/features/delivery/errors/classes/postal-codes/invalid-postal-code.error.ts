import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorTranslations } from '../../constants/delivery-error-translations';

export class InvalidPostalCodeError extends DeliveryPostalCodesError {
  constructor() {
    super(DELIVERY_POSTAL_CODES_ERROR_CODES.INVALID_POSTAL_CODE, DeliveryPostalCodesErrorTranslations.INVALID_POSTAL_CODE);
  }
}

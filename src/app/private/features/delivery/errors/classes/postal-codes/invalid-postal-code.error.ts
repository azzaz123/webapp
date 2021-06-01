import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorTranslations } from '../../constants/delivery-error-translations';

export class InvalidPostalCodeError extends DeliveryPostalCodesError {
  constructor() {
    super(DeliveryPostalCodesErrorTranslations.INVALID_POSTAL_CODE);
  }
}

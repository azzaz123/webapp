import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorTranslations } from '../../constants/delivery-error-translations';

export class PostalCodeDoesNotExistError extends DeliveryPostalCodesError {
  constructor() {
    super(DeliveryPostalCodesErrorTranslations.POSTAL_CODE_DOES_NOT_EXIST);
  }
}

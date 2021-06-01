import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorTranslations } from '../../constants/delivery-error-translations';

export class PostalCodeIsNotAllowed extends DeliveryPostalCodesError {
  constructor() {
    super(DeliveryPostalCodesErrorTranslations.POSTAL_CODE_NOT_ALLOWED);
  }
}

import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorTranslations } from '../../../../constants/delivery-error-translations';

export class PostalCodeIsNotAllowed extends DeliveryPostalCodesError {
  constructor() {
    super(DeliveryPostalCodesErrorEnum.POSTAL_CODE_IS_NOT_ALLOWED, DeliveryPostalCodesErrorTranslations.POSTAL_CODE_NOT_ALLOWED);
  }
}

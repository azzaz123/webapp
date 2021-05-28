import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorTranslations } from '../../../../constants/delivery-error-translations';

export class PostalCodeDoesNotExist extends DeliveryPostalCodesError {
  constructor() {
    super(DeliveryPostalCodesErrorEnum.POSTAL_CODE_DOES_NOT_EXISTS, DeliveryPostalCodesErrorTranslations.POSTAL_CODE_DOES_NOT_EXIST);
  }
}

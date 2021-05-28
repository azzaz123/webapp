import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';
import { DeliveryPostalCodesErrorTranslations } from '../../../../constants/delivery-error-translations';

export class InvalidPostalCodeError extends DeliveryPostalCodesError {
  constructor() {
    super(DeliveryPostalCodesErrorEnum.INVALID_POSTAL_CODE, DeliveryPostalCodesErrorTranslations.INVALID_POSTAL_CODE);
  }
}

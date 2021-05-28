import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';

export class PostalCodeDoesNotExist extends DeliveryPostalCodesError {
  constructor(public error_code: DeliveryPostalCodesErrorEnum.POSTAL_CODE_DOES_NOT_EXISTS, public message: string) {
    super(error_code, message);
  }
}

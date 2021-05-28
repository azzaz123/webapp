import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';

export class PostalCodeIsNotAllowed extends DeliveryPostalCodesError {
  constructor(public error_code: DeliveryPostalCodesErrorEnum.POSTAL_CODE_IS_NOT_ALLOWED, public message: string) {
    super(error_code, message);
  }
}

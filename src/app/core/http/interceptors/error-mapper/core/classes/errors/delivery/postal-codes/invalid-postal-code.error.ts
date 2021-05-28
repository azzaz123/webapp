import { DeliveryPostalCodesError } from './delivery-postal-codes.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';

export class InvalidPostalCode extends DeliveryPostalCodesError {
  constructor(public error_code: DeliveryPostalCodesErrorEnum.INVALID_POSTAL_CODE, public message: string) {
    super(error_code, message);
  }
}

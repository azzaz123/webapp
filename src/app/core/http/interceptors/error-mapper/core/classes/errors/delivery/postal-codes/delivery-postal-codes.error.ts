import { DeliveryError } from '../delivery.error';
import { DeliveryPostalCodesErrorEnum } from './delivery-postal-codes-error.enum';

export class DeliveryPostalCodesError extends DeliveryError {
  constructor(public error_code: DeliveryPostalCodesErrorEnum, public message: string) {
    super(error_code, message);
  }
}

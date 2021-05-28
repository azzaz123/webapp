import { DeliveryError } from '../delivery.error';
import { DELIVERY_POSTAL_CODES_ERROR_CODES } from './delivery-postal-codes-error.enum';

export class DeliveryPostalCodesError extends DeliveryError {
  constructor(public error_code: DELIVERY_POSTAL_CODES_ERROR_CODES, public message: string) {
    super(error_code, message);
  }
}

import { DeliveryError } from '../delivery.error';
import { DELIVERY_ADDRESS_ERROR_CODES } from './delivery-address-error.enum';

export class DeliveryAddressError extends DeliveryError {
  constructor(public error_code: DELIVERY_ADDRESS_ERROR_CODES, public message: string) {
    super(error_code, message);
  }
}

import { DeliveryError } from '../delivery.error';
export class DeliveryAddressError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

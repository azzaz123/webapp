import { DeliveryError } from '../delivery.error';
export abstract class DeliveryAddressError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

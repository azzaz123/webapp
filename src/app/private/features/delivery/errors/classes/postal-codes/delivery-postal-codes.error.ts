import { DeliveryError } from '../delivery.error';

export abstract class DeliveryPostalCodesError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

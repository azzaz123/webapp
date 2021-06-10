import { DeliveryError } from '../delivery.error';

export class DeliveryPostalCodesError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

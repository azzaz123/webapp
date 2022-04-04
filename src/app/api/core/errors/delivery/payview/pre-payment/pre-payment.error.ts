import { DeliveryError } from '@private/features/delivery/errors/classes/delivery.error';

export class PrePaymentError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

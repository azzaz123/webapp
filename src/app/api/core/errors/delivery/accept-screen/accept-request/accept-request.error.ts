import { DeliveryError } from '@private/features/delivery/errors/classes/delivery.error';

export class AcceptRequestError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

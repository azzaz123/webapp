import { DeliveryError } from '@private/features/delivery/errors/classes/delivery.error';

export class BuyerRequestsError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

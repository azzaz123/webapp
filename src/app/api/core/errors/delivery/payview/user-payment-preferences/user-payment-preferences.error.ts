import { DeliveryError } from '@private/features/delivery/errors/classes/delivery.error';

export class UserPaymentPreferencesError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

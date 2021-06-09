import { DeliveryError } from '../delivery.error';

export class BankAccountError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

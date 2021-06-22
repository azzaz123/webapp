import { DeliveryError } from '../delivery.error';

export abstract class BankAccountError extends DeliveryError {
  constructor(public message: string) {
    super(message);
  }
}

import { PaymentsError } from '../payments.error';

export class PaymentsCardsError extends PaymentsError {
  constructor(public message: string) {
    super(message);
  }
}

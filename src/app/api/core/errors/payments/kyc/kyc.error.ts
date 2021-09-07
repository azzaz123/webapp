import { PaymentsError } from '../payments.error';

export class KYCError extends PaymentsError {
  constructor(public message: string) {
    super(message);
  }
}

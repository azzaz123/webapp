import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class NoPaymentSelectedError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.NO_PAYMENT_SELECTED);
  }
}

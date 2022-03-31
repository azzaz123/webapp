import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class PrePaymentUnknownError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.PRE_PAYMENT_UNKOWN_ERROR);
  }
}

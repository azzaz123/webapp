import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class PaymentInfoMissingError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.PAYMENT_INFO_MISSING);
  }
}

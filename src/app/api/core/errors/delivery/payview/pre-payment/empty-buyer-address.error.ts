import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class EmptyBuyerAddressError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.EMPTY_BUYER_ADDRESS);
  }
}

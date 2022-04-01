import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class EmptyPostOfficeAddressError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.EMPTY_POST_OFFICE_ADDRESS);
  }
}

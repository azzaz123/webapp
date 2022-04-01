import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class EmptyPostOfficeReturnAddressError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.EMPTY_POST_OFFICE_RETURN_ADDRESS);
  }
}

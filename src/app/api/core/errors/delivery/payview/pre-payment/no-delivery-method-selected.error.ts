import { PrePaymentErrorTranslations } from './pre-payment-error-translations';
import { PrePaymentError } from './pre-payment.error';

export class NoDeliveryMethodSelectedError extends PrePaymentError {
  constructor() {
    super(PrePaymentErrorTranslations.NO_DELIVERY_METHOD_SELECTED);
  }
}

import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class InternationalShippingNotEnabledForUserError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.INTERNATIONAL_SHIPPING_NOT_ENABLED_FOR_USER);
  }
}

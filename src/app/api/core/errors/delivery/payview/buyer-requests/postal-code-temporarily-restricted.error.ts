import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class PostalCodeTemporarilyRestrictedError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.POSTAL_CODE_TEMPORARILY_RESTRICTED);
  }
}

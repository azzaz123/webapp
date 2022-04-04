import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class InvalidCardError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.INVALID_CARD);
  }
}

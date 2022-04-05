import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class MaxRequestNumberExceededError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.MAX_REQUEST_NUMBER_EXCEEDED);
  }
}

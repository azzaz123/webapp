import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class UserHasNoCardError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.USER_HAS_NO_CARD);
  }
}

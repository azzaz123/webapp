import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class BlockedSellerError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.BLOCKED_SELLER);
  }
}

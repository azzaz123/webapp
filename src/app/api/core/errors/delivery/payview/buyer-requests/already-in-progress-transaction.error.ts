import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class AlreadyInProgressTransactionError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.ALREADY_IN_PROGRESS_TRANSACTION);
  }
}

import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class DuplicatedRequestError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.DUPLICATED_REQUEST);
  }
}

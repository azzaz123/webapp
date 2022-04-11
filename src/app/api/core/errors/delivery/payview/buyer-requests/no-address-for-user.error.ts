import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class NoAddressForUserError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.NO_ADDRESS_FOR_USER);
  }
}

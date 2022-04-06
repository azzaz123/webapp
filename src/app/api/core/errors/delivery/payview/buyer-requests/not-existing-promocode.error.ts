import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class NotExistingPromocodeError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.NOT_EXISTING_PROMOCODE);
  }
}

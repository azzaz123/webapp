import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class ExpiredPromocodeError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.EXPIRED_PROMOCODE);
  }
}

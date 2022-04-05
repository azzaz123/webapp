import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class NotActiveYetPromocodeError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.NOT_ACTIVE_YET_PROMOCODE);
  }
}

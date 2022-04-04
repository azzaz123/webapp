import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class AlreadyUsedPromocodeError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.ALREADY_USED_PROMOCODE);
  }
}

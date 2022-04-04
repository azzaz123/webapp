import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class NotShippableItemError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.NOT_SHIPPABLE_ITEM);
  }
}

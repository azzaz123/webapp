import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class NonPurchasableItemError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.NON_PURCHASABLE_ITEM);
  }
}

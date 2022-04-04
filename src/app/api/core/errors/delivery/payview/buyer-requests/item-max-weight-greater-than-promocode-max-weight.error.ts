import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class ItemMaxWeightGreaterThanPromocodeMaxWeightError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.ITEM_MAX_WEIGHT_GREATER_THAN_PROMOCODE_MAX_WEIGHT);
  }
}

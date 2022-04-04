import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class ItemCategoryDifferentToPromocodeItemCategoryError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.ITEM_CATEGORY_DIFFERENT_TO_PROMOCODE_ITEM_CATEGORY);
  }
}

import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class ItemPriceSmallerThanPromocodeMinPriceError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.ITEM_PRICE_SMALLER_THAN_PROMOCODE_MIN_PRICE);
  }
}

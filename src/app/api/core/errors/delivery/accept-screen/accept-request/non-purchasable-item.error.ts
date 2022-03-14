import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class NonPurchasableItemError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.NON_PURCHASABLE_ITEM);
  }
}

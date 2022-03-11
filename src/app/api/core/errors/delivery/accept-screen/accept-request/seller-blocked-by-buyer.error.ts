import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class SellerBlockedByBuyerError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.SELLER_BLOCKED_BY_BUYER);
  }
}

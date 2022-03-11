import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class BuyerBlockedBySellerError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.BUYER_BLOCKED_BY_SELLER);
  }
}

import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class SellerBlockForFraudError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.SELLER_BLOCK_FOR_FRAUD);
  }
}

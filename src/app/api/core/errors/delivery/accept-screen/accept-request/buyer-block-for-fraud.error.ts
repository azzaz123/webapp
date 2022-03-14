import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class BuyerBlockForFraudError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.BUYER_BLOCK_FOR_FRAUD);
  }
}

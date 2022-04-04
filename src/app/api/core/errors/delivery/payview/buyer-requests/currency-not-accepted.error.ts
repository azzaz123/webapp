import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class CurrencyNotAcceptedError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.CURRENCY_NOT_ACCEPTED);
  }
}

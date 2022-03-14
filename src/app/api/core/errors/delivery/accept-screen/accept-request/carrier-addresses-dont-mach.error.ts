import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class CarrierAddressesDontMatchError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.CARRIER_ADDRESSES_DONT_MATCH);
  }
}

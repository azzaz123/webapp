import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class PostalCodeTemporarilyRestrictedError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.POSTAL_CODE_TEMPORARILY_RESTRICTED);
  }
}

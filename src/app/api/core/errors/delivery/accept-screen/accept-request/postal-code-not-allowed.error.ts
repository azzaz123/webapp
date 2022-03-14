import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class PostalCodeNotAllowedError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.POSTAL_CODE_NOT_ALLOWED);
  }
}

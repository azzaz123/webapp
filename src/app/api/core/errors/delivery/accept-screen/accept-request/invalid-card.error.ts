import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class InvalidCardError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.INVALID_CARD);
  }
}

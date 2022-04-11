import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class RequestNotFoundError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.REQUEST_NOT_FOUND);
  }
}

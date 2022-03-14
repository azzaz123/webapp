import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class IsNotPendingRequestError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.IS_NOT_PENDING_REQUEST);
  }
}

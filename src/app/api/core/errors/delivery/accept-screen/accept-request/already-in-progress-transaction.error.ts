import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class AlreadyInProgressTransactionError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.ALREADY_IN_PROGRESS_TRANSACTION);
  }
}

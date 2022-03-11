import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class NotShippableItemError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.NOT_SHIPPABLE_ITEM);
  }
}

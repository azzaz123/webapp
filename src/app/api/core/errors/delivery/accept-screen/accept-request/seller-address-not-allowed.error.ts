import { AcceptRequestErrorTranslations } from './accept-request-error-translations';
import { AcceptRequestError } from './accept-request.error';

export class SellerAddressNotAllowedError extends AcceptRequestError {
  constructor() {
    super(AcceptRequestErrorTranslations.SELLER_ADDRESS_NOT_ALLOWED);
  }
}

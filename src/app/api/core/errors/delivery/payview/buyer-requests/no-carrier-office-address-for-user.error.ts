import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class NoCarrierOfficeAddressForUserError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.NO_CARRIER_OFFICE_ADDRESS_FOR_USER);
  }
}

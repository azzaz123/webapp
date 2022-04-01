import { BuyerRequestsErrorTranslations } from './buyer-requests-error-translations';
import { BuyerRequestsError } from './buyer-requests.error';

export class CarrierOfficeAddressAndHomeAddressCountriesDoNotMatchError extends BuyerRequestsError {
  constructor() {
    super(BuyerRequestsErrorTranslations.CARRIER_OFFICE_ADDRESS_AND_HOME_ADDRESS_COUNTRIES_DO_NOT_MATCH);
  }
}

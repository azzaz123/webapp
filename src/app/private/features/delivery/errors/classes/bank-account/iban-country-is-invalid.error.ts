import { DeliveryBankAccountErrorTranslations } from '../../constants/delivery-error-translations';
import { BankAccountError } from './bank-account.error';

export class IbanCountryIsInvalidError extends BankAccountError {
  constructor() {
    super(DeliveryBankAccountErrorTranslations.IBAN_COUNTRY_INVALID);
  }
}

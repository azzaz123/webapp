import { DeliveryBankAccountErrorTranslations } from '../../constants/delivery-error-translations';
import { BankAccountError } from './bank-account.error';

export class IbanIsInvalidError extends BankAccountError {
  constructor() {
    super(DeliveryBankAccountErrorTranslations.IBAN_INVALID);
  }
}

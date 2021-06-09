import { DeliveryBankAccountErrorTranslations } from '../../constants/delivery-error-translations';
import { BankAccountError } from './bank-account.error';

export class UniqueBankAccountByUserError extends BankAccountError {
  constructor() {
    super(DeliveryBankAccountErrorTranslations.UNIQUE_BANK_ACCOUNT);
  }
}

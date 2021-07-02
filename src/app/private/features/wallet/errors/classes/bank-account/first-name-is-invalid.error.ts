import { WalletBankAccountErrorTranslations } from '../../constants/wallet-error-translations';
import { BankAccountError } from './bank-account.error';

export class FirstNameIsInvalidError extends BankAccountError {
  constructor() {
    super(WalletBankAccountErrorTranslations.OWNER_FIRST_NAME_INVALID);
  }
}

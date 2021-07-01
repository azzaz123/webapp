import { WalletBankAccountErrorTranslations } from '../../constants/wallet-error-translations';
import { BankAccountError } from './bank-account.error';

export class LastNameIsInvalidError extends BankAccountError {
  constructor() {
    super(WalletBankAccountErrorTranslations.OWNER_LAST_NAME_INVALID);
  }
}

import { WalletBankAccountErrorTranslations } from '../../constants/wallet-error-translations';
import { BankAccountError } from './bank-account.error';

export class IbanIsInvalidError extends BankAccountError {
  constructor() {
    super(WalletBankAccountErrorTranslations.IBAN_INVALID);
  }
}

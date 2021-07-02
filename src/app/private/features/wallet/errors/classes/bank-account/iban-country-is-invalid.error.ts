import { WalletBankAccountErrorTranslations } from '../../constants/wallet-error-translations';
import { BankAccountError } from './bank-account.error';

export class IbanCountryIsInvalidError extends BankAccountError {
  constructor() {
    super(WalletBankAccountErrorTranslations.IBAN_COUNTRY_INVALID);
  }
}

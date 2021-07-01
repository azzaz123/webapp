import { BankAccountError } from './bank-account.error';

export class UniqueBankAccountByUserError extends BankAccountError {
  constructor(messageFromBackend: string) {
    super(messageFromBackend);
  }
}

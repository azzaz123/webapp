import { BankAccountError } from './bank-account.error';

export class PlatformResponseIsInvalidError extends BankAccountError {
  constructor(messageFromBackend: string) {
    super(messageFromBackend);
  }
}

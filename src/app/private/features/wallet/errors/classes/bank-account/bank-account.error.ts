import { WalletError } from '../wallet.error';

export abstract class BankAccountError extends WalletError {
  constructor(public message: string) {
    super(message);
  }
}

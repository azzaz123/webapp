import { WalletError } from '@private/features/wallet/errors/classes/wallet.error';

export abstract class WalletTransferErrorModel extends WalletError {
  constructor(public message: string) {
    super(message);
  }
}

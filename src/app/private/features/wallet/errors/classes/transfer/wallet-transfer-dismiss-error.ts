import { WalletTransferError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error';

export class WalletTransferDismissError extends WalletTransferError {
  constructor() {
    super(null);
  }
}

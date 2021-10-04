import { WalletTransferErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error.model';

export class WalletTransferDismissErrorModel extends WalletTransferErrorModel {
  constructor() {
    super(null);
  }
}

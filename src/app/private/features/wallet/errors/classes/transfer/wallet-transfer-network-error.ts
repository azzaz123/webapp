import { WalletTransferError } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error';
import { WalletTransferErrorTranslations } from '@private/features/wallet/errors/constants/wallet-transfer-error-translations';

export class WalletTransferNetworkError extends WalletTransferError {
  constructor() {
    super(WalletTransferErrorTranslations.Network);
  }
}

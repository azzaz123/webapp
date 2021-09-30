import { WalletTransferErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error.model';
import { WalletTransferErrorTranslations } from '@private/features/wallet/errors/constants/wallet-transfer-error-translations';

export class WalletTransferGenericErrorModel extends WalletTransferErrorModel {
  constructor() {
    super(WalletTransferErrorTranslations.Generic);
  }
}

import { WalletTransferErrorModel } from '@private/features/wallet/errors/classes/transfer/wallet-transfer-error.model';
import { WalletTransferErrorTranslations } from '@private/features/wallet/errors/constants/wallet-transfer-error-translations';

export class WalletTransferPayUserBankAccountErrorModel extends WalletTransferErrorModel {
  constructor() {
    super(WalletTransferErrorTranslations.Reviewing);
  }
}

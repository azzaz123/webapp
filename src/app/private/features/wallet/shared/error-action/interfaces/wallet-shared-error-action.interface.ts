import { WalletSharedErrorActionKeyEnum } from './../enums/wallet-shared-error-action-key.enum';

export interface WalletSharedErrorActionInterface {
  key: WalletSharedErrorActionKeyEnum;
  data?: unknown;
}

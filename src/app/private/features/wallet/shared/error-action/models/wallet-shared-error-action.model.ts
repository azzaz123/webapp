import { WalletSharedErrorActionInterface } from './../interfaces/wallet-shared-error-action.interface';
import { WalletSharedErrorActionKeyEnum } from './../enums/wallet-shared-error-action-key.enum';

export class WalletSharedErrorActionModel implements WalletSharedErrorActionInterface {
  data: unknown;
  key: WalletSharedErrorActionKeyEnum;

  constructor(key: WalletSharedErrorActionKeyEnum, data: unknown) {
    this.key = key;
    this.data = data;
  }
}

import { Money } from '@api/core/model/money.interface';

export interface WalletTransferMoneyInterface extends Money {
  balance: Money;
}

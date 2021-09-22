import { Money } from '../../money.interface';

export enum WALLET_HISTORY_MOVEMENT_TYPE {
  IN,
  OUT,
}

export interface WalletMovementHistoryDetail {
  imageUrl: string;
  type: WALLET_HISTORY_MOVEMENT_TYPE;
  title: string;
  description: string;
  estimatedPayoutDescription?: string;
  date: Date;
  moneyAmmount: Money;
}

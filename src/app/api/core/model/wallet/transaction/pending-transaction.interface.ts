import { Money } from '../../money.interface';

export interface PendingTransaction {
  itemHash: string;
  itemImageUrl: string;
  itemTitle: string;
  moneyAmount: Money;
}

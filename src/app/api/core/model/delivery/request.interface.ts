import { TransactionItem, TransactionUser } from '..';
import { Money } from '../money.interface';

export interface Request {
  id: string;
  item: TransactionItem;
  buyer: TransactionUser;
  seller: TransactionUser;
  moneyAmount: Money;
  isCurrentUserTheSeller: boolean;
}

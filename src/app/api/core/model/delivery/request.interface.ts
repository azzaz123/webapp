import { TransactionItem, TransactionUser } from './transaction';
import { Money } from '../money.interface';

export interface Request {
  id: string;
  item: TransactionItem;
  buyer: TransactionUser;
  seller: TransactionUser;
  moneyAmount: Money;
  isCurrentUserTheSeller: boolean;
}

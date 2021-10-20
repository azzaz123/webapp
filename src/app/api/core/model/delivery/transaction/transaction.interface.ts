import { TransactionItem, TransactionUser } from '.';
import { Money } from '../../money.interface';
import { TRANSACTION_STATUS, TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS } from './status';

export interface Transaction {
  id: string;
  item: TransactionItem;
  buyer: TransactionUser;
  seller: TransactionUser;
  moneyAmount: Money;
  status: {
    transaction: TRANSACTION_STATUS;
    delivery: TRANSACTION_DELIVERY_STATUS;
    payment: TRANSACTION_PAYMENT_STATUS;
  };
}

import { Transaction } from '.';
import { TRANSACTION_STATUS, TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS } from './status';

export interface TrackeableTransaction<T> extends Transaction {
  status: {
    transaction: TRANSACTION_STATUS;
    delivery: TRANSACTION_DELIVERY_STATUS;
    payment: TRANSACTION_PAYMENT_STATUS;
    tracking: T;
  };
}

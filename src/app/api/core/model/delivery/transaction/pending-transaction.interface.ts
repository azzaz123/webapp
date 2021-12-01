import { TRANSACTION_STATUS, TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS, ONGOING_TRANSACTION_TRACKING_STATUS } from './status';
import { Transaction } from './transaction.interface';

export interface PendingTransaction extends Transaction {
  status: {
    transaction: TRANSACTION_STATUS.PENDING;
    delivery: TRANSACTION_DELIVERY_STATUS;
    payment: TRANSACTION_PAYMENT_STATUS;
    tracking: ONGOING_TRANSACTION_TRACKING_STATUS;
  };
}

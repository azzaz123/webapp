import { Transaction } from '.';
import {
  TRANSACTION_STATUS,
  TRANSACTION_DELIVERY_STATUS,
  TRANSACTION_PAYMENT_STATUS,
  COMPLETED_TRANSACTION_TRACKING_STATUS,
} from './status';
import { TrackeableTransaction } from './trackeable-transaction.interface';

export interface HistoricTransaction extends Transaction, TrackeableTransaction<COMPLETED_TRANSACTION_TRACKING_STATUS> {
  creationDate: Date;
  status: {
    transaction: TRANSACTION_STATUS;
    delivery: TRANSACTION_DELIVERY_STATUS;
    payment: TRANSACTION_PAYMENT_STATUS;
    tracking: COMPLETED_TRANSACTION_TRACKING_STATUS;
  };
}

import { CARRIER_DROP_OFF_MODE } from '../carrier-drop-off-mode.type';
import { TRANSACTION_STATUS, TRANSACTION_DELIVERY_STATUS, TRANSACTION_PAYMENT_STATUS, ONGOING_TRANSACTION_TRACKING_STATUS } from './status';
import { TrackeableTransaction } from './trackeable-transaction.interface';
import { Transaction } from './transaction.interface';

export interface PendingTransaction extends Transaction, TrackeableTransaction<ONGOING_TRANSACTION_TRACKING_STATUS> {
  status: {
    transaction: TRANSACTION_STATUS.PENDING;
    delivery: TRANSACTION_DELIVERY_STATUS;
    payment: TRANSACTION_PAYMENT_STATUS;
    tracking: ONGOING_TRANSACTION_TRACKING_STATUS;
  };
  carrierDropOffMode: CARRIER_DROP_OFF_MODE;
}

import { DELIVERY_ONGOING_STATUS } from './transaction/delivery-status/delivery-ongoing-status.enum';
import { DELIVERY_ONGOING_STATES } from './transaction/delivery-status/delivery-ongoing-states.enum';
import { DeliveryPendingTransaction } from './transaction/delivery-pending-transaction.interface';

export interface Request extends DeliveryPendingTransaction {
  state: DELIVERY_ONGOING_STATES.REQUEST_CREATED;
  status: {
    name: DELIVERY_ONGOING_STATUS.REQUEST_CREATED;
    translation: string;
  };
}

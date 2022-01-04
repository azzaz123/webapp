import { TransactionItem, TransactionUser } from '.';
import { Money } from '../../money.interface';
import { DELIVERY_ONGOING_STATUS } from './delivery-status/delivery-ongoing-status.enum';

export interface DeliveryPendingTransaction {
  id: string;
  item: TransactionItem;
  buyer: TransactionUser;
  seller: TransactionUser;
  moneyAmount: Money;
  status: {
    name: DELIVERY_ONGOING_STATUS;
    translation: string;
  };
  isCurrentUserTheSeller: boolean;
  requestId: string;
}

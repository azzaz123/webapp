import { TransactionItem, TransactionUser } from '.';
import { Money } from '../../money.interface';
import { DELIVERY_ONGOING_STATES } from './delivery-status/delivery-ongoing-states.enum';
import { DELIVERY_ONGOING_STATUS } from './delivery-status/delivery-ongoing-status.enum';

export interface TransactionalEntity {
  id: string;
  item: TransactionItem;
  buyer: TransactionUser;
  seller: TransactionUser;
  moneyAmount: Money;
  state: DELIVERY_ONGOING_STATES;
  status: {
    name: DELIVERY_ONGOING_STATUS;
    translation: string;
  };
  isCurrentUserTheSeller: boolean;
}

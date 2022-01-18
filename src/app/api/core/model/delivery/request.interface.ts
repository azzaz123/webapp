import { DELIVERY_ONGOING_STATUS } from './transaction/delivery-status/delivery-ongoing-status.enum';
import { DELIVERY_ONGOING_STATES } from './transaction/delivery-status/delivery-ongoing-states.enum';
import { TransactionalEntity } from './transaction/transactional-entity.interface';

export interface Request extends TransactionalEntity {
  state: DELIVERY_ONGOING_STATES.REQUEST_CREATED;
  status: {
    name: DELIVERY_ONGOING_STATUS.REQUEST_CREATED;
    translation: string;
  };
}

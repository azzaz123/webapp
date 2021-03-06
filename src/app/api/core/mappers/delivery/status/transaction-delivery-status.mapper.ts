import { TRANSACTION_DELIVERY_STATUS } from '@api/core/model/delivery/transaction/status';
import { ToDomainMapper } from '@api/core/utils/types';

enum TRANSACTION_DELIVERY_STATUS_API {
  PENDING_REGISTRATION = 'pending registration',
  PENDING_DELIVERY_TO_CARRIER = 'pending delivery to carrier',
  DELIVERED_TO_CARRIER = 'delivered to carrier',
  IN_TRANSIT = 'in transit',
  DELIVERED = 'delivered',
  LOST = 'lost',
  RETURNED = 'returned',
  AVAILABLE_FOR_THE_RECIPIENT = 'available for the recipient',
  FAILED = 'failed',
  ATTEMPT_PICKUP_FAILED = 'attempt pickup failed',
  ATTEMPT_DELIVERY_FAILED = 'attempt delivery failed',
  ON_HOLD_AT_CARRIER = 'on hold at carrier',
  ON_HOLD_INSTRUCTIONS_RECEIVED = 'on hold instructions received',
}

const transactionDeliveryStatusApiRelation: Record<string, TRANSACTION_DELIVERY_STATUS> = {
  [TRANSACTION_DELIVERY_STATUS_API.PENDING_REGISTRATION]: TRANSACTION_DELIVERY_STATUS.PENDING_REGISTRATION,
  [TRANSACTION_DELIVERY_STATUS_API.PENDING_DELIVERY_TO_CARRIER]: TRANSACTION_DELIVERY_STATUS.PENDING_DELIVERY_TO_CARRIER,
  [TRANSACTION_DELIVERY_STATUS_API.DELIVERED_TO_CARRIER]: TRANSACTION_DELIVERY_STATUS.DELIVERED_TO_CARRIER,
  [TRANSACTION_DELIVERY_STATUS_API.IN_TRANSIT]: TRANSACTION_DELIVERY_STATUS.IN_TRANSIT,
  [TRANSACTION_DELIVERY_STATUS_API.DELIVERED]: TRANSACTION_DELIVERY_STATUS.DELIVERED,
  [TRANSACTION_DELIVERY_STATUS_API.LOST]: TRANSACTION_DELIVERY_STATUS.LOST,
  [TRANSACTION_DELIVERY_STATUS_API.RETURNED]: TRANSACTION_DELIVERY_STATUS.RETURNED,
  [TRANSACTION_DELIVERY_STATUS_API.AVAILABLE_FOR_THE_RECIPIENT]: TRANSACTION_DELIVERY_STATUS.AVAILABLE_FOR_THE_RECIPIENT,
  [TRANSACTION_DELIVERY_STATUS_API.FAILED]: TRANSACTION_DELIVERY_STATUS.FAILED,
  [TRANSACTION_DELIVERY_STATUS_API.ATTEMPT_PICKUP_FAILED]: TRANSACTION_DELIVERY_STATUS.ATTEMPT_PICKUP_FAILED,
  [TRANSACTION_DELIVERY_STATUS_API.ATTEMPT_DELIVERY_FAILED]: TRANSACTION_DELIVERY_STATUS.ATTEMPT_DELIVERY_FAILED,
  [TRANSACTION_DELIVERY_STATUS_API.ON_HOLD_AT_CARRIER]: TRANSACTION_DELIVERY_STATUS.ON_HOLD_AT_CARRIER,
  [TRANSACTION_DELIVERY_STATUS_API.ON_HOLD_INSTRUCTIONS_RECEIVED]: TRANSACTION_DELIVERY_STATUS.ON_HOLD_INSTRUCTIONS_RECEIVED,
};

export const mapTransactionDeliveryStatusApiToModel: ToDomainMapper<string, TRANSACTION_DELIVERY_STATUS> = (
  input: string
): TRANSACTION_DELIVERY_STATUS => {
  return transactionDeliveryStatusApiRelation[input];
};

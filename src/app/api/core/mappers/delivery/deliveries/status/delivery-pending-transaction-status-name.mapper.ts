import { DeliveryOngoingBuyerStatusDto } from '@api/bff/delivery/deliveries/ongoing/dtos';
import { DELIVERY_ONGOING_STATUS } from '@api/core/model/delivery/transaction/delivery-status/delivery-ongoing-status.enum';
import { ToDomainMapper } from '@api/core/utils/types';

const deliveryPendingTransactionStatusApiRelation: Record<DeliveryOngoingBuyerStatusDto, DELIVERY_ONGOING_STATUS> = {
  ['REQUEST_CREATED']: DELIVERY_ONGOING_STATUS.REQUEST_CREATED,
  ['TRANSACTION_CREATED']: DELIVERY_ONGOING_STATUS.TRANSACTION_CREATED,
  ['DELIVERED_TO_CARRIER']: DELIVERY_ONGOING_STATUS.DELIVERED_TO_CARRIER,
  ['IN_TRANSIT']: DELIVERY_ONGOING_STATUS.IN_TRANSIT,
  ['DELIVERED']: DELIVERY_ONGOING_STATUS.DELIVERED,
  ['ON_HOLD_AT_CARRIER']: DELIVERY_ONGOING_STATUS.ON_HOLD_AT_CARRIER,
  ['ON_HOLD_INSTRUCTIONS_RECEIVED']: DELIVERY_ONGOING_STATUS.ON_HOLD_INSTRUCTIONS_RECEIVED,
  ['AVAILABLE_FOR_THE_RECIPIENT_CARRIER_OFFICE']: DELIVERY_ONGOING_STATUS.AVAILABLE_FOR_THE_RECIPIENT_CARRIER_OFFICE,
  ['AVAILABLE_FOR_THE_RECIPIENT_HOME_PICKUP']: DELIVERY_ONGOING_STATUS.AVAILABLE_FOR_THE_RECIPIENT_HOME_PICKUP,
  ['DELIVERY_PENDING_TO_RETRY']: DELIVERY_ONGOING_STATUS.DELIVERY_PENDING_TO_RETRY,
  ['PICKUP_PENDING_TO_RETRY']: DELIVERY_ONGOING_STATUS.PICKUP_PENDING_TO_RETRY,
  ['HOME_PICK_DELIVERY_FAILED']: DELIVERY_ONGOING_STATUS.HOME_PICK_DELIVERY_FAILED,
  ['TRANSACTION_ERROR']: DELIVERY_ONGOING_STATUS.TRANSACTION_ERROR,
  ['DISPUTE_OPEN']: DELIVERY_ONGOING_STATUS.DISPUTE_OPEN,
  ['DISPUTE_ACCEPTED']: DELIVERY_ONGOING_STATUS.DISPUTE_ACCEPTED,
  ['DISPUTE_ACCEPTED_BY_WALLAPOP']: DELIVERY_ONGOING_STATUS.DISPUTE_ACCEPTED_BY_WALLAPOP,
  ['DISPUTE_ESCALATED']: DELIVERY_ONGOING_STATUS.DISPUTE_ESCALATED,
  ['TRANSACTION_DEFAULT']: DELIVERY_ONGOING_STATUS.TRANSACTION_DEFAULT,
  ['REQUEST_DEFAULT']: DELIVERY_ONGOING_STATUS.REQUEST_DEFAULT,
};

export const mapDeliveryPendingTransactionStatusName: ToDomainMapper<string, DELIVERY_ONGOING_STATUS> = (
  input: string
): DELIVERY_ONGOING_STATUS => {
  return deliveryPendingTransactionStatusApiRelation[input];
};

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';

export interface PayviewDeliveryEvent {
  payload: DeliveryBuyerDeliveryMethod | null;
  type: PAYVIEW_DELIVERY_EVENT_TYPE;
}

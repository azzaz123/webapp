import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PayviewDeliveryEventType } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.interface';

export interface PayviewDeliveryEvent {
  payload: DeliveryBuyerDeliveryMethod | null;
  type: PayviewDeliveryEventType;
}

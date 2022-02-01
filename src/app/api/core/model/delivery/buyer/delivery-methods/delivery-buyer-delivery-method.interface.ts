import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerAddressUsed, DeliveryBuyerCarrier, DeliveryBuyerDeliveryTime } from '@api/core/model/delivery/buyer/delivery-methods';

export interface DeliveryBuyerDeliveryMethod {
  carrier: DeliveryBuyerCarrier;
  deliveryTimes: DeliveryBuyerDeliveryTime;
  icon: string;
  lastAddressUsed: DeliveryBuyerAddressUsed;
  method: DELIVERY_MODE;
}

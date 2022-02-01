import {
  DeliveryBuyerAddressUsed,
  DeliveryBuyerCarrier,
  DeliveryBuyerDeliveryMode,
  DeliveryBuyerDeliveryTime,
} from '@api/core/model/delivery/buyer/delivery-methods';

export interface DeliveryBuyerDeliveryMethod {
  carrier: DeliveryBuyerCarrier;
  deliveryTimes: DeliveryBuyerDeliveryTime;
  icon: string;
  lastAddressUsed: DeliveryBuyerAddressUsed;
  method: DeliveryBuyerDeliveryMode;
}

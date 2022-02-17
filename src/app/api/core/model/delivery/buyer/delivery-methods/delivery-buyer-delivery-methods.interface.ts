import { DeliveryBuyerDefaultDeliveryMethod, DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';

export interface DeliveryBuyerDeliveryMethods {
  current: DeliveryBuyerDeliveryMethod;
  deliveryMethods: DeliveryBuyerDeliveryMethod[];
  default: DeliveryBuyerDefaultDeliveryMethod;
}

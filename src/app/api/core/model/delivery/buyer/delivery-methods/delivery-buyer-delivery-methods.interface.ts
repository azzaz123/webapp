import { DeliveryBuyerDefaultDeliveryMethod, DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';

export interface DeliveryBuyerDeliveryMethods {
  deliveryMethods: DeliveryBuyerDeliveryMethod[];
  default: DeliveryBuyerDefaultDeliveryMethod;
}

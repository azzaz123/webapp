import { DeliveryBuyerDefaultDeliveryMethod, DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';

export interface DeliveryBuyerDeliveryMethods {
  addressLabel: string;
  current: DeliveryBuyerDeliveryMethod;
  deliveryMethods: DeliveryBuyerDeliveryMethod[];
  default: DeliveryBuyerDefaultDeliveryMethod;
}

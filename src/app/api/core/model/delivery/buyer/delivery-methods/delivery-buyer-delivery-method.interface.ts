import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { LastAddressUsed, DeliveryBuyerDeliveryTime } from '@api/core/model/delivery/buyer/delivery-methods';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';

export interface DeliveryBuyerDeliveryMethod {
  carrier: POST_OFFICE_CARRIER;
  deliveryTimes: DeliveryBuyerDeliveryTime;
  icon: string;
  lastAddressUsed: LastAddressUsed;
  method: DELIVERY_MODE;
}

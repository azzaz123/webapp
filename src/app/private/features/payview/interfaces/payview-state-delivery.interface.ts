import { DeliveryAddress } from '@api/core/model/delivery/address/delivery-address.interface';
import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';

export interface PayviewStateDelivery {
  address: DeliveryAddress;
  costs: DeliveryCosts;
  methods: DeliveryBuyerDeliveryMethods;
}

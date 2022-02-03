import { DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { PayviewDeliveryAddress } from '@private/features/payview/interfaces/payview-delivery-address.interface';

export interface PayviewStateDelivery {
  address: PayviewDeliveryAddress;
  costs: DeliveryCosts;
  methods: DeliveryBuyerDeliveryMethods;
}

import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { Item } from '@core/item/item';
import { PayviewStateDelivery } from './payview-state-delivery.interface';
import { PayviewStatePayment } from './payview-state-payment.interface';

export interface PayviewState {
  costs: DeliveryBuyerCalculatorCosts;
  delivery: PayviewStateDelivery;
  item: Item;
  itemDetails: BuyerRequestsItemsDetails;
  payment: PayviewStatePayment;
}

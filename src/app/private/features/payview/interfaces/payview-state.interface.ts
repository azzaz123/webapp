import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { PayviewItem } from '@private/features/payview/interfaces/payview-item.interface';
import { PayviewStateDelivery } from '@private/features/payview/interfaces/payview-state-delivery.interface';
import { PayviewStatePayment } from '@private/features/payview/interfaces/payview-state-payment.interface';

export interface PayviewState {
  costs: DeliveryBuyerCalculatorCosts;
  delivery: PayviewStateDelivery;
  item: PayviewItem;
  itemDetails: BuyerRequestsItemsDetails;
  payment: PayviewStatePayment;
  buyerRequestId: string;
}

import { DeliveryBuyerCalculatorCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-cost.interface';
import { DeliveryBuyerCalculatorPromotionCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-promotion-cost.interface';

export interface DeliveryBuyerCalculatorCosts {
  buyerCost: DeliveryBuyerCalculatorCost;
  promotion: DeliveryBuyerCalculatorPromotionCost;
}

import { DeliveryBuyerCalculatorCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-cost.interface';
import { Money } from '@api/core/model/money.interface';

export interface DeliveryBuyerCalculatorPromotionCost {
  deliveryCostDiscountPercentage: number;
  deliveryCostFixedPrice: Money;
  feesDiscountPercentatge: number;
  feesFixedPrice: Money;
  originalBuyerCost: DeliveryBuyerCalculatorCost;
  promocode: string;
}

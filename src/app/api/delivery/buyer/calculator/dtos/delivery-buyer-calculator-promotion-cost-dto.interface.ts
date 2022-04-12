import { DeliveryBuyerCalculatorCostDto } from './delivery-buyer-calculator-cost-dto.interface';

export interface DeliveryBuyerCalculatorPromotionCostDto {
  delivery_cost_discount_percentage: number;
  fees_discount_percentage: number;
  original_buyer_cost: DeliveryBuyerCalculatorCostDto;
  description?: string;
}

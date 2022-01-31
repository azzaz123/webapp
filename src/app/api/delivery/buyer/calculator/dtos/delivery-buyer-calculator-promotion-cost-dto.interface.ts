import { DeliveryBuyerCalculatorCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-cost-dto.interface';
import { PriceDto } from '@api/core/dtos';

export interface DeliveryBuyerCalculatorPromotionCostDto {
  delivery_cost_discount_percentage: number;
  delivery_cost_fixed_price: PriceDto;
  fees_fixed_price: PriceDto;
  original_buyer_cost: DeliveryBuyerCalculatorCostDto;
  promocode: string;
}

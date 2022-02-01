import { DeliveryBuyerCalculatorCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-cost-dto.interface';
import { DeliveryBuyerCalculatorPromotionCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-promotion-cost-dto.interface';

export interface DeliveryBuyerCalculatorCostsDto {
  buyer_cost: DeliveryBuyerCalculatorCostDto;
  promotion: DeliveryBuyerCalculatorPromotionCostDto;
}

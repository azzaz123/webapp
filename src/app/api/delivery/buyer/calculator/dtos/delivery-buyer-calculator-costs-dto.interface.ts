import { DeliveryBuyerCalculatorCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-cost-dto.interface';
import { DeliveryBuyerCalculatorPromocodeCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-promocode-cost-dto.interface';
import { DeliveryBuyerCalculatorPromotionCostDto } from './delivery-buyer-calculator-promotion-cost-dto.interface';

export interface DeliveryBuyerCalculatorCostsDto {
  buyer_cost: DeliveryBuyerCalculatorCostDto;
  promocode?: DeliveryBuyerCalculatorPromocodeCostDto;
  promotion?: DeliveryBuyerCalculatorPromotionCostDto;
}

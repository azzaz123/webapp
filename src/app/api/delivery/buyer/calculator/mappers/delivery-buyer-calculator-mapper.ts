import { DeliveryBuyerCalculatorCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-cost.interface';
import { DeliveryBuyerCalculatorCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-cost-dto.interface';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorCostsDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-costs-dto.interface';
import { DeliveryBuyerCalculatorPromotionCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-promotion-cost.interface';
import { DeliveryBuyerCalculatorPromotionCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-promotion-cost-dto.interface';
import { mapAmountAndCurrenyToMoney } from '@api/core/mappers';
import { PriceDto } from '@api/core/dtos';
import { ToDomainMapper } from '@api/core/utils/types';

export const mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts: ToDomainMapper<
  DeliveryBuyerCalculatorCostsDto,
  DeliveryBuyerCalculatorCosts
> = (input: DeliveryBuyerCalculatorCostsDto) => {
  const { buyer_cost: buyerCost, promotion } = input;

  return {
    buyerCost: mapToDeliveryBuyerCalculatorCost(buyerCost),
    promotion: mapToDeliveryBuyerCalculatorPromotionCost(promotion),
  };
};

const mapToDeliveryBuyerCalculatorCost = (input: DeliveryBuyerCalculatorCostDto): DeliveryBuyerCalculatorCost => {
  return {
    deliveryCost: mapAmountAndCurrenyToMoney<PriceDto>(input.delivery_cost),
    fees: mapAmountAndCurrenyToMoney<PriceDto>(input.fees),
    productPrice: mapAmountAndCurrenyToMoney<PriceDto>(input.product_price),
    total: mapAmountAndCurrenyToMoney<PriceDto>(input.total),
  };
};

const mapToDeliveryBuyerCalculatorPromotionCost = (
  input: DeliveryBuyerCalculatorPromotionCostDto
): DeliveryBuyerCalculatorPromotionCost => {
  return !!input
    ? {
        deliveryCostDiscountPercentage: input.delivery_cost_discount_percentage,
        deliveryCostFixedPrice: mapAmountAndCurrenyToMoney<PriceDto>(input.delivery_cost_fixed_price),
        feesFixedPrice: mapAmountAndCurrenyToMoney<PriceDto>(input.fees_fixed_price),
        originalBuyerCost: mapToDeliveryBuyerCalculatorCost(input.original_buyer_cost),
        promocode: input.promocode,
      }
    : null;
};

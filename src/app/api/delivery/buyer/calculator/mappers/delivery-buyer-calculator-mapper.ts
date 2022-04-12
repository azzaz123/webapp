import { DeliveryBuyerCalculatorCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-cost.interface';
import { DeliveryBuyerCalculatorCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-cost-dto.interface';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorCostsDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-costs-dto.interface';
import { DeliveryBuyerCalculatorPromotionCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-promotion-cost.interface';
import { mapAmountAndCurrenyToMoney } from '@api/core/mappers';
import { PriceDto } from '@api/core/dtos';
import { ToDomainMapper } from '@api/core/utils/types';
import { DeliveryBuyerCalculatorPromocodeCostDto } from '../dtos/delivery-buyer-calculator-promocode-cost-dto.interface';
import { DeliveryBuyerCalculatorPromotionCostDto } from '../dtos/delivery-buyer-calculator-promotion-cost-dto.interface';
import { Money } from '@api/core/model/money.interface';

export const mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts: ToDomainMapper<
  DeliveryBuyerCalculatorCostsDto,
  DeliveryBuyerCalculatorCosts
> = (input: DeliveryBuyerCalculatorCostsDto) => {
  const { buyer_cost: buyerCost, promocode, promotion } = input;

  return {
    buyerCost: mapToDeliveryBuyerCalculatorCost(buyerCost),
    promotion: mapPromocodeOrPromotionToPromotion(promocode, promotion),
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

function mapPromocodeOrPromotionToPromotion(
  promocode: DeliveryBuyerCalculatorPromocodeCostDto,
  promotion: DeliveryBuyerCalculatorPromotionCostDto
): DeliveryBuyerCalculatorPromotionCost {
  if (promocode) {
    return mapToDeliveryBuyerCalculatorPromocodeCost(promocode);
  }
  if (promotion) {
    return mapToDeliveryBuyerCalculatorPromotionCost(promotion);
  }
}

const mapToDeliveryBuyerCalculatorPromocodeCost = (
  input: DeliveryBuyerCalculatorPromocodeCostDto
): DeliveryBuyerCalculatorPromotionCost => {
  return !!input
    ? {
        deliveryCostDiscountPercentage: input.delivery_cost_discount_percentage,
        deliveryCostFixedPrice: !!input.delivery_cost_fixed_price
          ? mapAmountAndCurrenyToMoney<PriceDto>(input.delivery_cost_fixed_price)
          : null,
        feesDiscountPercentatge: input.fees_discount_percentage,
        feesFixedPrice: !!input.fees_fixed_price ? mapAmountAndCurrenyToMoney<PriceDto>(input.fees_fixed_price) : null,
        originalBuyerCost: mapToDeliveryBuyerCalculatorCost(input.original_buyer_cost),
        promocode: input.promocode,
        promotionName: null,
      }
    : null;
};

const mapToDeliveryBuyerCalculatorPromotionCost = (
  input: DeliveryBuyerCalculatorPromotionCostDto
): DeliveryBuyerCalculatorPromotionCost => {
  return !!input
    ? {
        deliveryCostDiscountPercentage: input.delivery_cost_discount_percentage,
        deliveryCostFixedPrice: !!input.delivery_cost_discount_percentage
          ? getCostFixedPrice(input.delivery_cost_discount_percentage, input.original_buyer_cost.delivery_cost)
          : null,
        feesDiscountPercentatge: input.fees_discount_percentage,
        feesFixedPrice: !!input.fees_discount_percentage
          ? getCostFixedPrice(input.fees_discount_percentage, input.original_buyer_cost.fees)
          : null,
        originalBuyerCost: mapToDeliveryBuyerCalculatorCost(input.original_buyer_cost),
        promocode: null,
        promotionName: input.description,
      }
    : null;
};

function getCostFixedPrice(percentatge: number, deliveryCost: PriceDto): Money {
  const costWithPromotionApplied: PriceDto = {
    amount: deliveryCost.amount - (deliveryCost.amount * percentatge) / 100,
    currency: deliveryCost.currency,
  };

  return mapAmountAndCurrenyToMoney<PriceDto>(costWithPromotionApplied);
}

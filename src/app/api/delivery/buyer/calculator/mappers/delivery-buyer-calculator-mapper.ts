import { CurrencyCode } from '@api/core/model/currency.interface';
import { DeliveryBuyerCalculatorCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-cost.interface';
import { DeliveryBuyerCalculatorCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-cost-dto.interface';
import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerCalculatorCostsDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-costs-dto.interface';
import { DeliveryBuyerCalculatorPromotionCost } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-promotion-cost.interface';
import { DeliveryBuyerCalculatorPromotionCostDto } from '@api/delivery/buyer/calculator/dtos/delivery-buyer-calculator-promotion-cost-dto.interface';
import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { Money } from '@api/core/model/money.interface';
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

const mapMoneyToDomain = (input: PriceDto): Money => {
  return mapNumberAndCurrencyCodeToMoney({
    number: input.amount,
    currency: input.currency as CurrencyCode,
  });
};

const mapToDeliveryBuyerCalculatorCost = (input: DeliveryBuyerCalculatorCostDto): DeliveryBuyerCalculatorCost => {
  return {
    deliveryCost: mapMoneyToDomain(input.delivery_cost),
    fees: mapMoneyToDomain(input.fees),
    productPrice: mapMoneyToDomain(input.product_price),
    total: mapMoneyToDomain(input.total),
  };
};

const mapToDeliveryBuyerCalculatorPromotionCost = (
  input: DeliveryBuyerCalculatorPromotionCostDto
): DeliveryBuyerCalculatorPromotionCost => {
  return !!input
    ? {
        deliveryCostDiscountPercentage: input.delivery_cost_discount_percentage,
        deliveryCostFixedPrice: mapMoneyToDomain(input.delivery_cost_fixed_price),
        feesFixedPrice: mapMoneyToDomain(input.fees_fixed_price),
        originalBuyerCost: mapToDeliveryBuyerCalculatorCost(input.original_buyer_cost),
        promocode: input.promocode,
      }
    : null;
};

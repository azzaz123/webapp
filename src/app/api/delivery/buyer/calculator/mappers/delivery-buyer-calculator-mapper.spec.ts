import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts } from '@api/delivery/buyer/calculator/mappers/delivery-buyer-calculator-mapper';
import {
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE,
} from '@api/fixtures/delivery/buyer/delivery-buyer-calculator-costs-dto.fixtures.spec';

describe('mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts', () => {
  describe('when converting calculator costs without promotion code to web context', () => {
    it('should map to web context', () => {
      let result: DeliveryBuyerCalculatorCosts;

      result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE);

      expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS);
    });
  });

  describe('when converting calculator costs with promotion code to web context', () => {
    it('should map to web context', () => {
      let result: DeliveryBuyerCalculatorCosts;

      result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
        MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE
      );

      expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION);
    });
  });
});

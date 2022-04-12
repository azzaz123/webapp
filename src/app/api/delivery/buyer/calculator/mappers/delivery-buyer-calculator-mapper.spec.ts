import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts } from '@api/delivery/buyer/calculator/mappers/delivery-buyer-calculator-mapper';
import {
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_DELIVERY_COST,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_DELIVERY_COST_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_FEES_COST,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_FEES_COST_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_COST_FIXED_PRICE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_COST_FIXED_PRICE_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_FEES_FIXED_PRICE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_FEES_FIXED_PRICE_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_COST_FIXED_PRICE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_COST_FIXED_PRICE_RESPONSE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_FEES_FIXED_PRICE,
  MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_FEES_FIXED_PRICE_RESPONSE,
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

  describe('and there is a promocode', () => {
    describe('when converting calculator costs with promotion code to web context', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION);
      });
    });

    describe('when converting calculator costs without fixed delivery cost to web context', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_DELIVERY_COST_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_DELIVERY_COST);
      });
    });

    describe('when converting calculator costs without fixed fees cost to web context', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_FEES_COST_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITHOUT_FIXED_FEES_COST);
      });
    });
  });

  describe('and there is a promotion', () => {
    describe('and has delivery cost fixed price', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_COST_FIXED_PRICE_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_COST_FIXED_PRICE);
      });
    });

    describe('and has NOT delivery cost fixed price', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_COST_FIXED_PRICE_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_COST_FIXED_PRICE);
      });
    });

    describe('and has fees fixed price', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_FEES_FIXED_PRICE_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_FEES_FIXED_PRICE);
      });
    });

    describe('and has NOT fees fixed price', () => {
      it('should map to web context', () => {
        let result: DeliveryBuyerCalculatorCosts;

        result = mapDeliveryBuyerCalculatorCostsDtoToDeliveryBuyerCalculatorCosts(
          MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_FEES_FIXED_PRICE_RESPONSE
        );

        expect(result).toMatchObject(MOCK_DELIVERY_BUYER_CALCULATOR_COSTS_WITH_PROMOTION_NAME_AND_WITHOUT_FEES_FIXED_PRICE);
      });
    });
  });
});

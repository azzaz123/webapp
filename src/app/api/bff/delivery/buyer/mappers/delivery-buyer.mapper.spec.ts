import { mapDeliveryBuyerDeliveryMethodsDtoToDeliveryBuyerDeliveryMethods } from '@api/bff/delivery/buyer/mappers/delivery-buyer.mapper';
import {
  MOCK_DELIVERY_BUYER_DELIVERY_METHODS,
  MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE,
} from '@api/fixtures/bff/delivery/buyer/delivery-buyer.fixtures.spec';

describe('mapDeliveryBuyerDeliveryMethodsDtoToDeliveryBuyerDeliveryMethods', () => {
  describe('when mapping from delivery methods DTO', () => {
    it('should map to a delivery methods entity', () => {
      const result = mapDeliveryBuyerDeliveryMethodsDtoToDeliveryBuyerDeliveryMethods(MOCK_DELIVERY_BUYER_DELIVERY_METHODS_RESPONSE);

      expect(result).toMatchObject(MOCK_DELIVERY_BUYER_DELIVERY_METHODS);
    });
  });
});

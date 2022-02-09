import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { mapDeliveryCostsDtoToDeliveryCosts } from '@api/bff/delivery/costs/mappers/delivery-costs.mapper';
import { MOCK_DELIVERY_COSTS_ITEM, MOCK_DELIVERY_COSTS_RESPONSE } from '@api/fixtures/bff/delivery/costs/delivery-costs.fixtures.spec';

describe('mapDeliveryCostsItemDtoToDeliveryCostsItem', () => {
  describe('when mapping from costs information DTO', () => {
    it('should map to a delivery costs item entity', () => {
      const expected: DeliveryCosts = mapDeliveryCostsDtoToDeliveryCosts(MOCK_DELIVERY_COSTS_RESPONSE);
      expect(JSON.stringify(expected)).toEqual(JSON.stringify(MOCK_DELIVERY_COSTS_ITEM));
    });
  });
});

import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import { MOCK_DELIVERY_ITEM_DETAILS } from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import {
  MOCK_DELIVERY_ITEM_DETAILS_DTO,
  MOCK_DELIVERY_ITEM_DETAILS_WITHOUT_COSTS_DTO,
} from '@api/fixtures/delivery/item/detail/delivery-item-details-dto.fixtures.spec';
import { mapDeliveryItemDetailsDtoToDeliveryItemDetails } from './delivery-item-details.mapper';

describe('mapDeliveryItemDetailsDtoToDeliveryItemDetails', () => {
  describe('when converting delivery item details to web context', () => {
    describe('and when there are no delivery costs', () => {
      it('should map nothing', () => {
        let result: DeliveryItemDetails;

        result = mapDeliveryItemDetailsDtoToDeliveryItemDetails(MOCK_DELIVERY_ITEM_DETAILS_WITHOUT_COSTS_DTO);

        expect(result).toBe(null);
      });
    });

    describe('and when there are delivery costs', () => {
      it('should map to web context', () => {
        let result: DeliveryItemDetails;

        result = mapDeliveryItemDetailsDtoToDeliveryItemDetails(MOCK_DELIVERY_ITEM_DETAILS_DTO);

        expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_DELIVERY_ITEM_DETAILS));
      });
    });
  });
});

import { DeliveryItemDetails } from '@api/core/model/delivery/item-detail/delivery-item-details.interface';
import {
  MOCK_DELIVERY_ITEM_DETAILS,
  MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE,
  MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED,
} from '@api/fixtures/core/model/delivery/item-detail/delivery-item-detail.fixtures.spec';
import {
  MOCK_DELIVERY_ITEM_DETAILS_DTO,
  MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE_DTO,
  MOCK_DELIVERY_ITEM_DETAILS_WITH_SHIPPING_DISABLED_DTO,
} from '@api/fixtures/delivery/item/detail/delivery-item-details-dto.fixtures.spec';
import { mapDeliveryItemDetailsDtoToDeliveryItemDetails } from './delivery-item-details.mapper';

describe('mapDeliveryItemDetailsDtoToDeliveryItemDetails', () => {
  describe('when converting delivery item details to web context', () => {
    describe('and when the seller is not doing shipping', () => {
      it('should map to web context', () => {
        let result: DeliveryItemDetails;

        result = mapDeliveryItemDetailsDtoToDeliveryItemDetails(MOCK_DELIVERY_ITEM_DETAILS_WITH_SHIPPING_DISABLED_DTO);

        expect(result).toEqual(MOCK_DELIVERY_ITEM_DETAILS_SHIPPING_DISABLED);
      });
    });

    describe('and when there are delivery costs', () => {
      it('should map to web context', () => {
        let result: DeliveryItemDetails;

        result = mapDeliveryItemDetailsDtoToDeliveryItemDetails(MOCK_DELIVERY_ITEM_DETAILS_DTO);

        expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_DELIVERY_ITEM_DETAILS));
      });
    });

    describe('and when the item is not shippable', () => {
      it('should map to web context', () => {
        let result: DeliveryItemDetails;

        result = mapDeliveryItemDetailsDtoToDeliveryItemDetails(MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE_DTO);

        expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_DELIVERY_ITEM_DETAILS_NOT_SHIPPABLE));
      });
    });
  });
});

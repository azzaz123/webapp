import { BuyerRequestBuyDto } from '../../../dtos/buyer-request-buy-dto.interface';
import {
  MOCK_PAYVIEW_STATE,
  MOCK_PAYVIEW_STATE_WITH_CARRIER_OFFICE_DELIVERY_METHOD,
  MOCK_PAYVIEW_STATE_WITH_PROMOCODE,
} from '@fixtures/private/delivery/payview/payview-state.fixtures.spec';
import { mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties } from './buyer-request-buy.mapper';
import {
  MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS,
  MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS_AND_PROMOCODE,
  MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE,
} from '@api/fixtures/delivery/buyer/requests/buyer-request-buy-dto.fixtures.spec';

describe('mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties', () => {
  describe('when mapping the payview state properties into dto properties', () => {
    describe('and the delivery mode is buyer address', () => {
      it('should map the corresponding properties', () => {
        const result: BuyerRequestBuyDto = mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties(MOCK_PAYVIEW_STATE);

        expect(result).toEqual(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS);
      });
    });

    describe('and the delivery mode is carrier office', () => {
      it('should map the corresponding properties', () => {
        const result: BuyerRequestBuyDto = mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties(
          MOCK_PAYVIEW_STATE_WITH_CARRIER_OFFICE_DELIVERY_METHOD
        );

        expect(result).toEqual(MOCK_BUYER_REQUEST_BUY_DTO_WITH_CARRIER_OFFICE);
      });
    });

    describe('and there is a promotion promocode', () => {
      it('should map the corresponding properties', () => {
        const result: BuyerRequestBuyDto = mapPayviewStatePropertiesToBuyerRequestBuyDtoProperties(MOCK_PAYVIEW_STATE_WITH_PROMOCODE);

        expect(result).toEqual(MOCK_BUYER_REQUEST_BUY_DTO_WITH_BUYER_ADDRESS_AND_PROMOCODE);
      });
    });
  });
});

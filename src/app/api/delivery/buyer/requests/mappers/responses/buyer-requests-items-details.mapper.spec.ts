import { BuyerRequestsItemsDetails } from '@api/core/model/delivery/buyer-request/buyer-requests-items-details.interface';
import { mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails } from '@api/delivery/buyer/requests/mappers/responses/buyer-requests-items-details.mapper';
import {
  MOCK_BUYER_REQUESTS_ITEMS_DETAILS,
  MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO,
} from '@api/fixtures/delivery/buyer/requests/buyer-requests-items-details-dto.fixtures.spec';

describe('mapBuyerRequestsDtoToBuyerRequests', () => {
  describe('when converting buyer requests to web context', () => {
    it('should map to web context', () => {
      let result: BuyerRequestsItemsDetails;

      result = mapBuyerRequestsItemsDetailsDtoToBuyerRequestsItemsDetails(MOCK_BUYER_REQUESTS_ITEMS_DETAILS_DTO);

      expect(result).toMatchObject(MOCK_BUYER_REQUESTS_ITEMS_DETAILS);
    });
  });
});

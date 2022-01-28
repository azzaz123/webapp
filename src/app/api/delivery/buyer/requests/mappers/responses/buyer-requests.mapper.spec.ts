import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { MOCK_BUYER_REQUESTS } from '@api/fixtures/core/model/delivery/buyer-requests/buyer-request.fixtures.spec';
import { MOCK_BUYER_REQUESTS_DTO } from '@api/fixtures/delivery/buyer/requests/buyer-requests-dto.fixtures.spec';
import { mapBuyerRequestsDtoToBuyerRequests } from './buyer-requests.mapper';

describe('mapBuyerRequestsDtoToBuyerRequests', () => {
  describe('when converting buyer requests to web context', () => {
    it('should map to web context', () => {
      let result: BuyerRequest[];

      result = mapBuyerRequestsDtoToBuyerRequests(MOCK_BUYER_REQUESTS_DTO);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_BUYER_REQUESTS));
    });
  });
});

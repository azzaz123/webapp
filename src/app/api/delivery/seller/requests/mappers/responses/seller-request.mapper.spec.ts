import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { MOCK_SELLER_REQUEST_DTO } from '@api/fixtures/delivery/seller/requests/seller-request-dto.fixtures.spec';
import { MOCK_SELLER_REQUEST } from '@fixtures/private/delivery/seller-requests/seller-request.fixtures.spec';
import { mapSellerRequestDtoToSellerRequest } from './seller-request.mapper';

describe('mapSellerRequestDtoToSellerRequest', () => {
  describe('when converting seller request to web context', () => {
    it('should map to web context', () => {
      let result: SellerRequest;

      result = mapSellerRequestDtoToSellerRequest(MOCK_SELLER_REQUEST_DTO);

      expect(JSON.stringify(result)).toEqual(JSON.stringify(MOCK_SELLER_REQUEST));
    });
  });
});

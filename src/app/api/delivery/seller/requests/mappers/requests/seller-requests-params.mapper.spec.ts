import { HttpParams } from '@angular/common/http';
import { mapBuyerAndItemHashToSellerRequestsParams } from './seller-requests-params.mapper';

describe('mapBuyerAndItemHashToSellerRequestsParams', () => {
  const MOCK_ITEM_HASH: string = 'nz0g9gdlg7jo';
  const MOCK_BUYER_HASH: string = '8x6qnq34oe6y';

  describe('when converting buyer and item hash from web context to server', () => {
    it('should map to server context', () => {
      let result: HttpParams;
      const expectedResult = new HttpParams().appendAll({ buyer_user_hash: MOCK_BUYER_HASH, item_hash: MOCK_ITEM_HASH });

      result = mapBuyerAndItemHashToSellerRequestsParams({ buyerHash: MOCK_BUYER_HASH, itemHash: MOCK_ITEM_HASH });

      expect(result).toEqual(expectedResult);
    });
  });
});

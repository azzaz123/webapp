import { MOCK_MONEY } from '@api/fixtures/core/money.fixtures';
import { MOCK_ITEM_SALE_PRICE_REQUEST_DTO } from '@api/fixtures/items/sale_price/item-sale-price.fixtures.spec';
import { mapNewPriceToItemSalePrice } from './item-sale-price.mapper';

describe('mapNewPriceToItemSalePrice', () => {
  describe('when transforming web context request to server request', () => {
    it('should transform the data', () => {
      const result = mapNewPriceToItemSalePrice(MOCK_MONEY);

      expect(result).toEqual(MOCK_ITEM_SALE_PRICE_REQUEST_DTO);
    });
  });
});

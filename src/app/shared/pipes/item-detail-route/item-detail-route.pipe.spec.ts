import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemDetailRoutePipe } from './item-detail-route.pipe';

describe('ItemDetailRoutePipe', () => {
  describe('when transforming an item slug', () => {
    it('should return a item URL with valid format', () => {
      const pipe = new ItemDetailRoutePipe(MOCK_SITE_URL);
      const itemSlug = MOCK_ITEM.webSlug;

      const itemURL = pipe.transform(MOCK_ITEM.webSlug);

      expect(itemURL).toEqual(`${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${itemSlug}`);
    });
  });
});

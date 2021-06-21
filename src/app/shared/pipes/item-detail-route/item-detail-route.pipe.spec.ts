import { environment } from '@environments/environment';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemDetailRoutePipe } from './item-detail-route.pipe';

describe('ItemDetailRoutePipe', () => {
  describe('when transforming an item slug', () => {
    it('should return a item URL with valid format', () => {
      const SUBDOMAIN = 'it';
      const pipe = new ItemDetailRoutePipe(SUBDOMAIN);
      const itemSlug = MOCK_ITEM.webSlug;
      const expectedEnvironmentURL = environment.siteUrl.replace('es', SUBDOMAIN);

      const itemURL = pipe.transform(MOCK_ITEM.webSlug);

      expect(itemURL).toEqual(`${expectedEnvironmentURL}${PUBLIC_PATHS.ITEM_DETAIL}/${itemSlug}`);
    });
  });
});

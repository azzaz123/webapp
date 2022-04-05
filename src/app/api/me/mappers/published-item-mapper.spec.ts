import { mappedPublishedItemFixture, publishedItemFixture } from '@api/fixtures/me/published/published-item.fixture';
import { mapPublishedItemsToLegacyItem } from './published-item-mapper';

describe('PublishedItemMapper', () => {
  describe('mapPublishedItemsToLegacyItem', () => {
    it('should map to Item', () => {
      const items = mapPublishedItemsToLegacyItem([publishedItemFixture]);

      expect(items).toEqual([mappedPublishedItemFixture]);
    });
  });
});

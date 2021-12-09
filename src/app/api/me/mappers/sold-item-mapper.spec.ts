import { mapSoldItemsToLegacyItem } from './sold-item-mapper';
import { mappedSoldItemFixture, soldItemFixture } from '@api/fixtures/me/sold/sold-item.fixture';

describe('SoldItemMapper', () => {
  describe('mapSoldItemsToLegacyItem', () => {
    it('should map to Item', () => {
      const items = mapSoldItemsToLegacyItem([soldItemFixture]);

      expect(items).toEqual([mappedSoldItemFixture]);
    });
  });
});

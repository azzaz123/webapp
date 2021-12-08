import { mapFavouriteItemsToLegacyItem } from '@api/me/mappers/favourite-item-mapper';
import { favouriteItemFixture, mappedFavouriteItemFixture } from '@api/fixtures/me/favourites/favourite-item.fixture';

describe('FavouriteItemMapper', () => {
  describe('mapFavouriteItemsToLegacyItem', () => {
    it('should map to Item', () => {
      const items = mapFavouriteItemsToLegacyItem([favouriteItemFixture]);

      expect(items).toEqual([mappedFavouriteItemFixture]);
    });
  });
});

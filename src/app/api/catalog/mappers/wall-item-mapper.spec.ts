import {
  favouriteIdsFixture,
  mappedFavouritedWallItemFixture,
  mappedStorytellingWallItemFixture,
  mappedWallItemFixture,
  storytellingWallItemFixture,
  wallItemFixture,
} from '@api/fixtures/catalog/wall/wall-item.fixtures';
import { mapWallItemsToItemCards } from '@api/catalog/mappers/wall-item-mapper';

describe('WallItemMapper', () => {
  describe('when mapping from wall item dto to item card domain', () => {
    describe('with no favourites and no storytelling', () => {
      it('should map to item card domain', () => {
        const mappedImages = mapWallItemsToItemCards([wallItemFixture], []);

        expect(mappedImages).toEqual([mappedWallItemFixture]);
      });
    });

    describe('with favourites', () => {
      it('should map to item card domain', () => {
        const mappedImages = mapWallItemsToItemCards([wallItemFixture], favouriteIdsFixture);

        expect(mappedImages).toEqual([mappedFavouritedWallItemFixture]);
      });
    });

    describe('with category with storytelling', () => {
      it('should map to item card domain', () => {
        const storytellingMappedItem = mapWallItemsToItemCards([storytellingWallItemFixture], []);

        expect(storytellingMappedItem).toEqual([mappedStorytellingWallItemFixture]);
      });
    });
  });
});

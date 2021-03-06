import { mapPublishedItemsToItemCards } from './published-item-mapper';
import {
  storytellingPublishedItemFixture,
  publishedItemFixture,
  mappedStorytellingPublishedItemFixture,
  userIdFixture,
  mappedPublishedItemFixture,
  mappedFavouritedPublishedItemFixture,
  favoritedPublishedItemFixture,
} from '@api/fixtures/catalog/published/published-item.fixtures';

describe('CatalogImageMapper', () => {
  describe('when mapping from catalog item dto to item card domain', () => {
    describe('with no favourites and no storytelling', () => {
      it('should map to item card domain', () => {
        const mappedImages = mapPublishedItemsToItemCards([publishedItemFixture], userIdFixture);

        expect(mappedImages).toEqual([mappedPublishedItemFixture]);
      });
    });

    describe('with favourites', () => {
      it('should map to item card domain', () => {
        const mappedImages = mapPublishedItemsToItemCards([favoritedPublishedItemFixture], userIdFixture);

        expect(mappedImages).toEqual([mappedFavouritedPublishedItemFixture]);
      });
    });

    describe('with category with storytelling', () => {
      it('should map to item card domain', () => {
        const storytellingMappedItem = mapPublishedItemsToItemCards([storytellingPublishedItemFixture], userIdFixture);

        expect(storytellingMappedItem).toEqual([mappedStorytellingPublishedItemFixture]);
      });
    });
  });
});

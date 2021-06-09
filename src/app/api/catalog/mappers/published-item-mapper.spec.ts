import { mapCatalogItemsToItemCards } from './published-item-mapper';
import {
  storytellingCatalogItemFixture,
  catalogItemFixture,
  mappedStorytellingCatalogItemFixture,
  userIdFixture,
  mappedCatalogItemFixture,
  favouriteIdsFixture,
  mappedFavouritedCatalogItemFixture,
} from '../../fixtures/catalog/catalog-item.fixtures';

describe('CatalogImageMapper', () => {
  describe('when mapping from catalog item dto to item card domain', () => {
    describe('with no favourites and no storytelling', () => {
      it('should map to item card domain', () => {
        const mappedImages = mapCatalogItemsToItemCards([catalogItemFixture], userIdFixture, []);

        expect(mappedImages).toEqual([mappedCatalogItemFixture]);
      });
    });

    describe('with favourites', () => {
      it('should map to item card domain', () => {
        const mappedImages = mapCatalogItemsToItemCards([catalogItemFixture], userIdFixture, favouriteIdsFixture);

        expect(mappedImages).toEqual([mappedFavouritedCatalogItemFixture]);
      });
    });

    describe('with category with storytelling', () => {
      it('should map to item card domain', () => {
        const storytellingMappedItem = mapCatalogItemsToItemCards([storytellingCatalogItemFixture], userIdFixture, []);

        expect(storytellingMappedItem).toEqual([mappedStorytellingCatalogItemFixture]);
      });
    });
  });
});

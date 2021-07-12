import { mapCatalogImagesToImages } from './image-mapper';
import { publishedItemImageFixture, mappedPublishedItemImageFixture } from '@api/fixtures/catalog/published/catalog-image.fixtures';

describe('CatalogImageMapper', () => {
  describe('when mapping from catalog image dto to image domain', () => {
    it('should map to image domain', () => {
      const mappedImages = mapCatalogImagesToImages([publishedItemImageFixture]);
      expect(mappedImages).toEqual([mappedPublishedItemImageFixture]);
    });
  });
});

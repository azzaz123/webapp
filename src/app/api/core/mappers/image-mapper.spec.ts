import { mapImageDtosToImages } from './image-mapper';
import { catalogItemImageFixture, mappedCatalogItemImageFixture } from '@api/fixtures/catalog/catalog-image.fixtures';

describe('CatalogImageMapper', () => {
  describe('when mapping from catalog image dto to image domain', () => {
    it('should map to image domain', () => {
      const mappedImages = mapImageDtosToImages([catalogItemImageFixture]);
      expect(mappedImages).toEqual([mappedCatalogItemImageFixture]);
    });
  });
});

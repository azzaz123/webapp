import { mapCatalogImagesToImages } from './image-mapper';
import { catalogItemImageFixture, mappedCatalogItemImageFixture } from '../../fixtures/catalog/catalog-image.fixtures.spec';

describe('CatalogImageMapper', () => {
  describe('when mapping from catalog image dto to image domain', () => {
    it('should map to image domain', () => {
      const mappedImages = mapCatalogImagesToImages([catalogItemImageFixture]);
      expect(mappedImages).toEqual([mappedCatalogItemImageFixture]);
    });
  });
});

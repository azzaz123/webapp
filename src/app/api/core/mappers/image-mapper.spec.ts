import { mapImageDtosToImages } from './image-mapper';
import { itemImageFixture, mappedItemImageFixture } from '@api/fixtures/core/image.fixtures';

describe('CatalogImageMapper', () => {
  describe('when mapping from catalog image dto to image domain', () => {
    it('should map to image domain', () => {
      const mappedImages = mapImageDtosToImages([itemImageFixture]);
      expect(mappedImages).toEqual([mappedItemImageFixture]);
    });
  });
});

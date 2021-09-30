import { mapCategoriesToSearchCategories, mapCategoriesToUploadCategories } from './category-mapper';
import {
  categoriesFixture,
  mappedSearchCategoriesFixture,
  mappedUploadCategoriesFixture,
} from '@api/fixtures/categories/categories.fixtures';

describe('CategoryMapper', () => {
  describe('when mapping from category dto to upload category domain', () => {
    it('should map to upload category domain', () => {
      const mappedUploadCategories = mapCategoriesToUploadCategories(categoriesFixture);

      expect(mappedUploadCategories).toEqual(mappedUploadCategoriesFixture);
    });
  });

  describe('when mapping from category dto to search category domain', () => {
    it('should map to search category domain', () => {
      const mappedSearchCategories = mapCategoriesToSearchCategories(categoriesFixture);

      expect(mappedSearchCategories).toEqual(mappedSearchCategoriesFixture);
    });
  });
});

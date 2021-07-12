import { CatalogPublicProfileItemsResponse } from '@api/catalog/dtos/catalog-public-profile-items-response';
import { catalogItemFixture } from '@api/fixtures/catalog/catalog-item.fixtures';

export const catalogResponseFixture: CatalogPublicProfileItemsResponse = {
  data: [catalogItemFixture],
  meta: {
    next: 'nextParameter',
  },
};

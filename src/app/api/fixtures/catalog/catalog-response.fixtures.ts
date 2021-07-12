import { PublishedResponse } from '@api/catalog/dtos/published/published-response';
import { catalogItemFixture } from '@api/fixtures/catalog/catalog-item.fixtures';

export const catalogResponseFixture: PublishedResponse = {
  data: [catalogItemFixture],
  meta: {
    next: 'nextParameter',
  },
};

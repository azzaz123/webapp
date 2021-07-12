import { PublishedResponse } from '@api/catalog/dtos/published/published-response';
import { publishedItemFixture } from '@api/fixtures/catalog/published/published-item.fixtures';

export const publishedResponseFixture: PublishedResponse = {
  data: [publishedItemFixture],
  meta: {
    next: 'nextParameter',
  },
};

import { PublishedResponse } from '@api/catalog/dtos';
import { favoritedPublishedItemFixture, publishedItemFixture } from '@api/fixtures/catalog/published/published-item.fixtures';

export const publishedResponseFixture: PublishedResponse = {
  data: [publishedItemFixture],
  meta: {
    next: 'nextParameter',
  },
};

export const favoritedPublishedResponseFixture: PublishedResponse = {
  data: [favoritedPublishedItemFixture],
  meta: {
    next: 'nextParameter',
  },
};

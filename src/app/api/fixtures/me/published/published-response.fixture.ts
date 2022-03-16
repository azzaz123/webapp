import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { PublishedResponseDto } from '@api/me/dtos/published/response/published-response-dto';
import { mappedPublishedItemFixture, publishedItemFixture } from './published-item.fixture';

export const publishedResponseFixture: PublishedResponseDto = {
  data: [publishedItemFixture],
  meta: {
    next: 'SSMxODk2ODUyODFfRF9VIzc0ODIxMDMzX1AjMjAyMS0wNS0yNVQxNDoxMDoyM1o',
  },
};

export const mappedPublishedResponseFixture: PaginatedList<Item> = {
  list: [mappedPublishedItemFixture],
  paginationParameter: publishedResponseFixture.meta.next,
};

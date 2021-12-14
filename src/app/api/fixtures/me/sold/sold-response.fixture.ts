import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { SoldItemResponseDto } from '@api/me/dtos/sold/response/sold-response-dto';
import { mappedSoldItemFixture, soldItemFixture } from './sold-item.fixture';

export const soldItemsResponseFixture: SoldItemResponseDto = {
  data: [soldItemFixture],
  meta: {
    next: '20',
  },
};

export const mappedSoldItemsResponseFixture: PaginatedList<Item> = {
  list: [mappedSoldItemFixture],
  paginationParameter: soldItemsResponseFixture.meta.next,
};

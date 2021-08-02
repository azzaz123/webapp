import { FavouritesResponseDto } from '@api/me/dtos/favourites/response/favourites-response-dto';
import { favouriteItemFixture, mappedFavouriteItemFixture } from '@api/fixtures/me/favourites/favourite-item.fixture';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';

export const favouriteResponseFixture: FavouritesResponseDto = {
  data: [favouriteItemFixture],
  meta: {
    next: '20',
  },
};

export const mappedFavouriteResponseFixture: PaginatedList<Item> = {
  list: [mappedFavouriteItemFixture],
  paginationParameter: favouriteResponseFixture.meta.next,
};

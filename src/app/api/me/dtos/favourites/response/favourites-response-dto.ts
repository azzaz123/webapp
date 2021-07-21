import { FavouriteItemDto } from '@api/me/dtos/favourites/response/favourite-item-dto';

export interface FavouritesResponseDto {
  data: FavouriteItemDto[];
  meta: { next: string };
}

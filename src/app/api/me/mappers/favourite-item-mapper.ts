import { FavouriteItemDto } from '@api/me/dtos/favourites/response/favourite-item-dto';
import { Item } from '@core/item/item';
import { mapImageDtosToImages } from '@api/core/mappers';

export function mapFavouriteItemsToItemCards(favouriteItems: FavouriteItemDto[]): Item[] {
  return favouriteItems.map(({ id, title, category_id, images, price, slug, sold, bump, reserved }: FavouriteItemDto) => {
    const mappedImages = mapImageDtosToImages(images);
    const item = new Item(
      id,
      null,
      null,
      title,
      undefined,
      Number.parseInt(category_id),
      undefined,
      price.amount,
      price.currency,
      undefined,
      slug,
      {
        pending: false,
        sold: sold?.flag,
        favorite: true,
        reserved: reserved?.flag,
        banned: false,
        expired: false,
        bumped: !!bump?.type,
        bump_type: bump?.type,
      },
      undefined,
      undefined,
      mappedImages[0],
      mappedImages,
      slug
    );

    item.favorited = true;

    return item;
  });
}

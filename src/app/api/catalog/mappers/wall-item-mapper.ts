import { WallItem } from '@api/catalog/dtos';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { formatDescription } from '@api/catalog/mappers/utils';
import { mapImageDtosToImages } from '@api/core/mappers';

export function mapWallItemsToItemCards(wallItems: WallItem[], favouriteIds: string[]): ItemCard[] {
  return wallItems.map((item) => mapWallItemToItemCard(item, favouriteIds));
}

function mapWallItemToItemCard(item: WallItem, favoriteIds: string[]): ItemCard {
  const { id, category_id, title, description, price, images = [], attributes = [], slug, reserved, bump, type } = item;

  return {
    id,
    title,
    categoryId: category_id,
    description: formatDescription(type, description, attributes),
    salePrice: price.amount,
    currencyCode: price.currency,
    webSlug: slug,
    images: mapImageDtosToImages(images),
    flags: {
      pending: false,
      sold: false,
      expired: false,
      banned: false,
      reserved: !!reserved?.flag,
      bumped: !!bump?.type,
      favorite: favoriteIds.includes(id),
    },
  };
}

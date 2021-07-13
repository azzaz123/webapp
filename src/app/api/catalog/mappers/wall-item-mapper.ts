import { WallItem } from '@api/catalog/dtos';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { formatDescription } from '@api/catalog/mappers/utils';
import { mapCatalogImagesToImages } from '@api/catalog/mappers/image-mapper';

export function mapWallItemsToItemCards(wallItems: WallItem[], favouriteIds: string[]): ItemCard[] {
  return wallItems.map((item) => mapWallItemToItemCard(item, favouriteIds));
}

function mapWallItemToItemCard(item: WallItem, favoriteIds: string[]): ItemCard {
  const { id, title, description, price, images = [], attributes = [], slug, reserved, bump, type } = item;

  return {
    id,
    title,
    description: formatDescription(type, description, attributes),
    salePrice: price.amount,
    currencyCode: price.currency,
    webSlug: slug,
    images: mapCatalogImagesToImages(images),
    ownerId: undefined, // FIXME: This is required by ItemCard
    flags: {
      pending: false,
      sold: false,
      expired: false,
      banned: false,
      reserved: !!reserved?.flag,
      bumped: !!bump,
      favorite: favoriteIds.includes(id),
    },
  };
}

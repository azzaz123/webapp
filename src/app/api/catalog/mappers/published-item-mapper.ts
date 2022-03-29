import { PublishedItem } from '@api/catalog/dtos';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { mapImageDtosToImages } from '@api/core/mappers';
import { formatDescription } from '@api/catalog/mappers/utils';
import { ItemType } from '@api/core/model/item';
import { CATEGORY_IDS } from '@core/category/category-ids';

export function mapPublishedItemsToItemCards(publishedItems: PublishedItem[], userId: string): ItemCard[] {
  return publishedItems.map((item) => mapPublishedItemToItemCard(item, userId));
}

function mapPublishedItemToItemCard(item: PublishedItem, userId: string): ItemCard {
  const { id, category_id, title, description, price, images = [], type_attributes = {}, slug, reserved, bump, favorited } = item;

  return {
    id,
    title,
    categoryId: Number.parseInt(category_id),
    description: formatDescription(getItemType(category_id), description, type_attributes),
    salePrice: price.amount,
    currencyCode: price.currency,
    webSlug: slug,
    images: mapImageDtosToImages(images),
    ownerId: userId,
    flags: {
      pending: false,
      sold: false,
      expired: false,
      banned: false,
      reserved: !!reserved?.flag,
      bumped: !!bump,
      favorite: !!favorited?.flag,
    },
  };
}

// TODO: This will be removed once the endpoint provides type instead of category
function getItemType(categoryId: string): ItemType {
  switch (categoryId) {
    case CATEGORY_IDS.CAR.toString():
      return ItemType.CARS;
    case CATEGORY_IDS.REAL_ESTATE.toString():
      return ItemType.REAL_ESTATE;
    default:
      return ItemType.CONSUMER_GOODS;
  }
}

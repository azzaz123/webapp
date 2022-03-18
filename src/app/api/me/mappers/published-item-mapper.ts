import { mapImageDtosToImages } from '@api/core/mappers';
import { Item } from '@core/item/item';
import { PublishedItemDto } from '../dtos/published/response/published-item-dto';

export function mapPublishedItemsToLegacyItem(publishedItems: PublishedItemDto[]): Item[] {
  return publishedItems.map(
    ({
      id,
      title,
      category_id,
      images,
      price,
      slug,
      bump,
      reserved,
      created_date,
      modified_date,
      listing_limit,
      expired,
    }: PublishedItemDto) => {
      const mappedImages = mapImageDtosToImages(images);
      const item = new Item(
        id,
        null,
        undefined,
        title,
        undefined,
        Number.parseInt(category_id),
        undefined,
        price.amount,
        price.currency,
        modified_date,
        slug,
        {
          pending: false,
          sold: false,
          favorite: false,
          reserved: reserved?.flag,
          banned: false,
          expired: expired?.flag,
          bumped: !!bump?.type,
          bump_type: bump?.type,
          onhold: listing_limit?.exceeded,
        },
        undefined,
        undefined,
        mappedImages[0],
        mappedImages,
        slug,
        created_date
      );
      return item;
    }
  );
}

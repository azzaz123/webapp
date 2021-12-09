import { Item } from '@core/item/item';
import { mapImageDtosToImages } from '@api/core/mappers';
import { SoldItemDto } from '../dtos/sold/response/sold-item-dto';

export function mapSoldItemsToLegacyItem(soldItems: SoldItemDto[]): Item[] {
  return soldItems.map(({ id, title, category_id, images, price, slug, created_date, modified_date }) => {
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
      modified_date,
      slug,
      {
        pending: false,
        sold: true,
        favorite: false,
        reserved: false,
        banned: false,
        expired: false,
        bumped: false,
        bump_type: null,
      },
      undefined,
      undefined,
      mappedImages[0],
      mappedImages,
      slug,
      created_date
    );
    return item;
  });
}

import { SearchItem } from '../interfaces/search-item.interface';
import { Item } from '@core/item/item';

// TODO: This has to disappear. As soon as we get rid of the Item class
export function mapSearchItems(items: SearchItem[]): Item[] {
  return items.map(
    (item) =>
      new Item(
        item.id,
        undefined,
        undefined,
        item.title,
        item.description,
        undefined,
        undefined,
        item.price,
        item.currency,
        undefined,
        undefined,
        {
          bumped: item.flags.bumped,
          reserved: item.flags.reserved,
          favorite: item.flags.favourited,
          pending: undefined,
          banned: undefined,
          sold: undefined,
          expired: undefined,
        },
        undefined,
        undefined,
        {
          id: item.images[0],
          original_height: undefined,
          original_width: undefined,
          average_hex_color: undefined,
          urls_by_size: {
            original: undefined,
            small: item.images[0],
            medium: undefined,
            large: undefined,
            xlarge: undefined,
          },
        }
      )
  );
}

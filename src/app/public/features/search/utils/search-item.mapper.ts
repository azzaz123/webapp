import { SearchItem } from '../interfaces/search-item.interface';
import { ItemCard } from '@public/core/interfaces/item-card-core.interface';

export function mapSearchItems(items: SearchItem[]): ItemCard[] {
  return items.map((item) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      salePrice: item.price,
      webSlug: undefined, // TODO: We need to add this to SearchItem
      images: getImages(item),
      bumpFlags: {
        bumped: item.flags.bumped,
        country_bumped: item.flags.bumped, // TODO: We need to add this to the SearchItem
        boosted: undefined, // TODO: What's the difference?
        highlighted: undefined, // TODO: What's the difference?
        urgent: undefined, // TODO: Is this deprecated?
      },
      flags: {
        bumped: item.flags.bumped,
        reserved: item.flags.reserved,
        favorite: item.flags.favourited,
        highlighted: undefined, // TODO: What's the difference?
        urgent: undefined, // TODO: Deprecated?
        sold: false,
        pending: false,
        banned: false,
        expired: false,
      },
      currencyCode: item.currency,
      ownerId: undefined, // TODO: We need to add this to SearchItem
    };
  });
}

function getImages(item) {
  return item.images.map((image) => ({
    id: image,
    original_height: undefined,
    original_width: undefined,
    average_hex_color: undefined,
    urls_by_size: {
      original: image,
      small: image,
      medium: image,
      large: image,
      xlarge: image,
    },
  }));
}

import { SearchItem } from '@public/features/search/interfaces/search-item.interface';


export interface ItemSearchResponse {
  id: string;
  title: string;
  description: string;
  distance: number;
  images: {
    small: string;
  }[];
  flags: {
    reserved: boolean;
  };
  visibility_flags: {
    bumped: boolean;
  };
  price: number;
  currency: string;
  category_id: number;
}

export interface SearchResponse {
  search_objects: ItemSearchResponse[];
  from: number;
  to: number;
  distance_ordered: boolean;
  search_point: {
    latitude: number,
    longitude: number
  };
}

export function SearchResponseMapper({search_objects}: SearchResponse): SearchItem[] {
  return search_objects.map((item: ItemSearchResponse) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    currency: item.currency,
    images: item.images.map(image => image.small),
    flags: {
      favourited: false,
      reserved: item.flags.reserved,
      bumped: item.visibility_flags.bumped
    }
  } as SearchItem));
}

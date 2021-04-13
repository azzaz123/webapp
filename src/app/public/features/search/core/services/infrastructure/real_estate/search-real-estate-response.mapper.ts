import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchRealStateResponse } from './search-item-real-state-response';


export function searchItemRealEstateResponseMapper({search_objects}: SearchResponse<SearchRealStateResponse>): SearchItem[] {
  return search_objects.map(({id, title, content}: SearchRealStateResponse) => ({
    id,
    title,
    description: content.storytelling,
    price: content.price,
    currency: content.currency,
    images: content.images.map(({small}) => small),
    flags: {
      favourited: false,
      reserved: content.flags.reserved,
      bumped: content.visibility_flags.bumped
    }
  } as SearchItem));
}

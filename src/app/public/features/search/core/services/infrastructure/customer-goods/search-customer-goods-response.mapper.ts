
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchCustomerGoodsResponse } from './search-costumer-goods-response.interface';


export function SearchItemCustomerGoodsResponseMapper({search_objects}: SearchResponse<SearchCustomerGoodsResponse>): SearchItem[] {
  return search_objects.map((item: SearchCustomerGoodsResponse) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    currency: item.currency,
    images: item.images.map(({small}) => small),
    flags: {
      favourited: false,
      reserved: item.flags.reserved,
      bumped: item.visibility_flags.bumped
    }
  }));
}

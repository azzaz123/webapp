

import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchItemImageMapper } from '../models/search-item-image-mapper.response';
import { SearchCustomerGoodsResponse } from './search-costumer-goods-response.interface';


export function SearchItemCustomerGoodsResponseMapper({search_objects}: SearchResponse<SearchCustomerGoodsResponse>): ItemCard[] {
  return search_objects.map((item: SearchCustomerGoodsResponse) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    salePrice: item.price,
    currencyCode: item.currency,
    ownerId: item.user.id,
    webSlug: item.web_slug,
    images: item.images.map(SearchItemImageMapper),
    flags: {
      pending: item.flags.pending,
      sold: item.flags.sold,
      favorite: false,
      reserved: item.flags.reserved,
      banned: item.flags.banned,
      expired: item.flags.expired,
      onhold: item.flags.onhold
    },
    bumpFlags: {
      bumped: item.visibility_flags.bumped,
      highlighted: item.visibility_flags.highlighted,
      urgent: item.visibility_flags.urgent,
      country_bumped: item.visibility_flags.country_bumped,
      boosted: item.visibility_flags.boosted
    },
    categoryId: item.category_id,
    saleConditions: null,
  }));
}

import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchItemImageMapper } from '../models/search-item-image.response';
import { SearchRealEstateResponse } from './search-item-real-state-response';


export function searchItemRealEstateResponseMapper({search_objects}: SearchResponse<SearchRealEstateResponse>): ItemCard[] {
  return search_objects.map(({id, title, content}: SearchRealEstateResponse) => ({
    id,
    title,
    description: content.storytelling,
    salePrice: content.price,
    currencyCode: content.currency,
    ownerId: content.user.id,
    webSlug: content.web_slug,
    images: content.images.map(SearchItemImageMapper),
    flags: {
      pending: content.flags.pending,
      sold: content.flags.sold,
      favorite: false,
      reserved: content.flags.reserved,
      banned: content.flags.banned,
      expired: content.flags.expired,
      onhold: content.flags.onhold
    },
    bumpFlags: {
      bumped: content.visibility_flags.bumped,
      highlighted: content.visibility_flags.highlighted,
      urgent: content.visibility_flags.urgent,
      country_bumped: content.visibility_flags.country_bumped,
      boosted: content.visibility_flags.boosted
    },
    categoryId: content.category_id,
    saleConditions: null,
  }));
}

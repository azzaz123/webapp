import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchItemImageMapper } from '../models/search-item-image-mapper.response';
import { SearchItemRealStateResponse, SearchRealEstateResponse } from './search-item-real-state-response';

export const SURFACE_UNIT = 'm2';

export function searchItemRealEstateResponseMapper({ search_objects }: SearchResponse<SearchRealEstateResponse>): ItemCard[] {
  return search_objects.map(({ id, content }: SearchRealEstateResponse) => ({
    id,
    title: content.title,
    description: content.storytelling,
    salePrice: content.price,
    currencyCode: content.currency,
    distance: content.distance,
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
    specs: SearchItemRealEstateSpecsMapper(content)
  }));
}

export function SearchItemRealEstateSpecsMapper(content: SearchItemRealStateResponse): string[] {
  const specs: string[] = [];
  const { rooms, bathrooms, surface } = content;

  if (rooms) {
    const label = rooms > 1 ? $localize`:@@web_rooms:Rooms` : $localize`:@@web_room:Room`;

    specs.push(`${rooms} ${label}`);
  }
  if (bathrooms) {
    const label = bathrooms > 1 ? $localize`:@@web_bathrooms:Bathrooms` : $localize`:@@web_bathroom:Bathroom`;

    specs.push(`${bathrooms} ${label}`);
  }
  if (surface) {
    specs.push(`${surface} ${SURFACE_UNIT}`)
  }
  return specs;
}

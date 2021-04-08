import { ITEM_DATA_V3 } from '@fixtures/item.fixtures.spec';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { filtersWall } from './search-api-url.factory';
import { ItemSearchResponse, SearchResponse } from './search-response.interface';

export function FilterParametersWallBuilder(categoryId: string): FilterParameter[] {
  return filtersWall.map((key: string) => ({key, value: key === 'category_ids' ? categoryId : `${key}-value`}));
}

export function FilterParametersSearchBuilder(categoryId: string, search: string): FilterParameter[] {
  return [...filtersWall, 'keywords'].map((key: string) => ({key, value: key === 'category_ids' ? categoryId : `${key}-value`}));
}

export function ItemSearchResponseBuilder(partial: Partial<ItemSearchResponse> = {}): ItemSearchResponse {
  return {
    id: partial.id || '52352',
    title: partial.title || 'titleItem',
    description: partial.description || 'descriptionItem',
    distance: partial.distance || 32636,
    images: partial.images || [{small: 'http://cdn.wallapop.com/image'}],
    flags: partial.flags || {reserved: true},
    visibility_flags: partial.visibility_flags || {bumped: false},
    price: partial.price || 2352,
    currency: partial.currency || '€',
    category_id: partial.category_id
  }
}

export function SearchResponseBuilder(partial: Partial<SearchResponse> = {}): SearchResponse {
  return {
    from: partial.from || 0,
    to: partial.to || 20,
    distance_ordered: partial.distance_ordered || true,
    search_point: partial.search_point || {
      latitude: 40,
      longitude: 20
    },
    search_objects: new Array(20).fill('').map(() => ItemSearchResponseBuilder({category_id: 21423}))
  };
}


export function SearchResponseBuilderByCategoryId(category_id): SearchResponse {
  return {
    from: 0,
    to: 20,
    distance_ordered: true,
    search_point: {
      latitude: 40,
      longitude: 20
    },
    search_objects: new Array(20).fill('').map(() => ItemSearchResponseBuilder({category_id}))
  };
}

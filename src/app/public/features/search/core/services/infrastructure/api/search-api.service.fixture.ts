import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { filtersWall } from './search-api-url.factory';
import { ItemSearchResponse, SearchResponse } from '../search-response.interface';

export function FilterParametersWallFactory(categoryId: string): FilterParameter[] {
  return filtersWall.map((key: string) => ({ key, value: key === 'category_ids' ? categoryId : `${key}-value` }));
}

export function FilterParametersSearchFactory(categoryId: string, search: string): FilterParameter[] {
  return [...filtersWall, 'keywords'].map((key: string) => ({ key, value: key === 'category_ids' ? categoryId : `${key}-value` }));
}

export function ItemSearchResponseFactory(partial: Partial<ItemSearchResponse> = {}): ItemSearchResponse {
  return {
    id: partial.id || '52352',
    title: partial.title || 'titleItem',
    description: partial.description || 'descriptionItem',
    distance: partial.distance || 32636,
    images: partial.images || [{ small: 'http://cdn.wallapop.com/image' }],
    flags: partial.flags || { reserved: true },
    visibility_flags: partial.visibility_flags || { bumped: false },
    price: partial.price || 2352,
    currency: partial.currency || '€',
    category_id: partial.category_id,
  };
}

export function SearchResponseFactory(partial: Partial<SearchResponse> = {}): SearchResponse {
  return {
    from: partial.from || 0,
    to: partial.to || 20,
    distance_ordered: partial.distance_ordered || true,
    search_point: partial.search_point || {
      latitude: 40,
      longitude: 20,
    },
    search_objects: new Array(20).fill('').map(() => ItemSearchResponseFactory({ category_id: 21423 })),
  };
}

export function SearchResponseByCategoryIdFactory(category_id, count: number = 40): SearchResponse {
  return {
    from: 0,
    to: 20,
    distance_ordered: true,
    search_point: {
      latitude: 40,
      longitude: 20,
    },
    search_objects: new Array(count).fill('').map(() => ItemSearchResponseFactory({ category_id })),
  };
}

export const X_NEXT_PAGE_HEADER = (category_id) =>
  'density_type=30&latitude=41.38804&start=40&step=0&num_results=40&search_id=56a6f352-f3e8-459f-8959-bb88e6568d33&longitude=2.17001&filters_source=seo_landing&language=es_ES&category_ids=' +
  category_id;

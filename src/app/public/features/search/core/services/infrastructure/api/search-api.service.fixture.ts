import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { wallParameters } from './search-api-url.factory';
import { SearchResponse } from './search-response.interface';
import { SearchCustomerGoodsResponse } from '../customer-goods/search-costumer-goods-response.interface';
import { SEARCH_ITEMS_MINIMAL_LENGTH } from '../../constants/search-item-max';
import { SearchCarResponse } from '../cars/search-car-response';
import { SearchBaseItemResponse } from '../models/search-base-item.response';
import { SearchRealEstateResponse } from '../real_estate/search-item-real-state-response';

export function FilterParametersWallFactory(categoryId: string): FilterParameter[] {
  return wallParameters.map((key: string) => ({ key, value: key === 'category_ids' ? categoryId : `${key}-value` }));
}

export function FilterParametersSearchFactory(categoryId: string, search: string): FilterParameter[] {
  return [...wallParameters, 'keywords'].map((key: string) => ({ key, value: key === 'category_ids' ? categoryId : `${key}-value` }));
}

function SearchBaseItemResponseFactory(): SearchBaseItemResponse {
  return {
    id: '52352',
    title: 'titleItem',
    distance: 32636,
    images: [{ small: 'http://cdn.wallapop.com/image' }],
    flags: { reserved: true },
    visibility_flags: { bumped: false },
    price: 2352,
    currency: '€',
    web_slug: 'www.webslug.com',
    category_id: 1,
  }
}

export function SearchCustomerGoodsItemListResponseFactory(count: number = SEARCH_ITEMS_MINIMAL_LENGTH): SearchCustomerGoodsResponse[] {
  return new Array(count).fill('').map(() => ({
    ...SearchBaseItemResponseFactory(),
    description: 'Description',
    free_shipping: false,
    shipping_allowed: false,
    seller_id: '235235'
  }));
}

export function SearchCarItemListResponseFactory(count: number = SEARCH_ITEMS_MINIMAL_LENGTH): SearchCarResponse[] {
  return new Array(count).fill('').map(() => ({
    id: '32532',
    title: 'titleItem',
    content: {
      ...SearchBaseItemResponseFactory(),
      brand: 'brand-value',
      model: 'model-value',
      year: 2010,
      version: 'version-value',
      km: 25000,
      engine: 'engine-value',
      gearbox: 'gearbox-value',
      horsepower: 150,
      storytelling: 'storytelling-value',
    }
  }));
}

export function SearchRealEstateItemlistResponseFactory(count: number = SEARCH_ITEMS_MINIMAL_LENGTH): SearchRealEstateResponse[] {
  return new Array(count).fill('').map(() => ({
    id: '32532',
    title: 'titleItem',
    content: {
      ...SearchBaseItemResponseFactory(),
      operation: 'operation',
      type: 'type',
      surface: 2,
      rooms: 2,
      bathrooms: 1,
      garage: true,
      terrace: true,
      elevator: true,
      pool: true,
      garden: false,
      condition: 'Conditions',
      storytelling: 'storytelling'
    }
  }));
}

export function SearchResponseFactory<T>(partial: Partial<SearchResponse<T>> = {}): SearchResponse<T> {
  return {
    from: partial.from || 0,
    to: partial.to || 20,
    distance_ordered: partial.distance_ordered || true,
    search_point: partial.search_point || {
      latitude: 40,
      longitude: 20,
    },
    search_objects: partial.search_objects || []
  };
}

export const X_NEXT_PAGE_HEADER = (category_id) =>
  'density_type=30&latitude=41.38804&start=40&step=0&num_results=40&search_id=56a6f352-f3e8-459f-8959-bb88e6568d33&longitude=2.17001&filters_source=seo_landing&language=es_ES&category_ids=' +
  category_id;

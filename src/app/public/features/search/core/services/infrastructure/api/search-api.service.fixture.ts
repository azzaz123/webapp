import { IMAGE } from '@fixtures/user.fixtures.spec';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETERS_SEARCH } from '../../constants/filter-parameters';
import { SEARCH_ITEMS_MINIMAL_LENGTH } from '../../constants/search-item-max';
import { SearchCarResponse } from '../cars/search-car-response';
import { SearchCustomerGoodsResponse } from '../customer-goods/search-costumer-goods-response.interface';
import { SearchBaseItemResponse } from '../models/search-base-item.response';
import { SearchItemImageResponse } from '../models/search-item-image.response';
import { SearchRealEstateResponse } from '../real_estate/search-item-real-state-response';
import { wallParameters } from './search-api-url.factory';
import { SearchResponse } from './search-response.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MOCK_SEARCH_ID } from '../../search-list-tracking-events/search-list-tracking-events.fixtures.spec';
import { SORT_BY } from '@public/features/search/components/sort-filter/services/constants/sort-by-options-constants';

export function FilterParametersWallFactory(categoryId: string): FilterParameter[] {
  return wallParameters.map((key: FILTER_QUERY_PARAM_KEY) => ({ key, value: key === FILTER_PARAMETERS_SEARCH.CATEGORY_ID ? categoryId : `${key}-value` }));
}

export function FilterParametersSearchFactory(categoryId: string, search: string): FilterParameter[] {
  return [...wallParameters, 'keywords']
    .map((key: FILTER_QUERY_PARAM_KEY) => ({ key, value: key === FILTER_PARAMETERS_SEARCH.CATEGORY_ID ? categoryId : `${key}-value` }));
}

function SearchBaseItemResponseFactory(): SearchBaseItemResponse {
  return {
    id: '52352',
    title: 'titleItem',
    distance: 32636,
    images: [SearchItemImageResponseFactory()],
    flags: {
      banned: false,
      expired: false,
      onhold: false,
      pending: false,
      reserved: false,
      sold: false,
     },
    visibility_flags: {
      boosted: false,
      bumped: false,
      country_bumped: false,
      highlighted: false,
      urgent: false,
    },
    price: 2352,
    currency: '€',
    web_slug: 'www.webslug.com',
    category_id: 1,
    user: {
      id: '235325',
      image: SearchItemImageResponseFactory(),
      kind: 'kind',
      micro_name: 'micro_name',
      online: true
    }
  };
}

function SearchItemImageResponseFactory(): SearchItemImageResponse {
  return {
    large: 'cdn.wallapop.com/image/large/1',
    medium: 'cdn.wallapop.com/image/medium/1',
    original: 'cdn.wallapop.com/image/original/1',
    original_height: 800,
    original_width: 640,
    small: 'cdn.wallapop.com/image/small/1',
    xlarge: 'cdn.wallapop.com/image/xlarge/1',
    xsmall: 'cdn.wallapop.com/image/xsmall/1'
  };
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
    search_objects: partial.search_objects || [],
    order: partial.order || SORT_BY.DISTANCE
  };
}

export const X_NEXT_PAGE_HEADER = (category_id) =>
  'density_type=30&latitude=41.38804&start=40&step=0&num_results=40&search_id=' + MOCK_SEARCH_ID + '&longitude=2.17001&filters_source=seo_landing&language=es_ES&category_ids=' +
  category_id;

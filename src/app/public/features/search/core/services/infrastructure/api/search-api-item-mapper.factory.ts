import { CATEGORY_IDS } from '@core/category/category-ids';
import { SearchItem } from '@public/features/search/interfaces/search-item.interface';
import { SearchItemCarResponseMapper } from '../cars/search-cars-response.mapper';
import { SearchItemCustomerGoodsResponseMapper } from '../customer-goods/search-customer-goods-response.mapper';
import { searchItemRealEstateResponseMapper } from '../real_estate/search-real-estate-response.mapper';
import { SearchResponse } from './search-response.interface';

export type SearchItemMapper<T> = (item: SearchResponse<T>) => SearchItem[];

const ItemCategoryIdMapper: Record<number, SearchItemMapper<any>> = {
  [CATEGORY_IDS.CAR]: SearchItemCarResponseMapper,
  [CATEGORY_IDS.REAL_ESTATE]: searchItemRealEstateResponseMapper,
};

export function SearchApiItemMapperFactory<T>(categoryId: string): SearchItemMapper<T>  {
  return ItemCategoryIdMapper[+categoryId] || SearchItemCustomerGoodsResponseMapper;
}

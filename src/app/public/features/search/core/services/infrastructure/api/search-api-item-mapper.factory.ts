
import { CATEGORY_IDS } from '@core/category/category-ids';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SearchItemCarResponseMapper } from '../cars/search-cars-response.mapper';
import { SearchItemCustomerGoodsResponseMapper } from '../customer-goods/search-customer-goods-response.mapper';
import { searchItemRealEstateResponseMapper } from '../real_estate/search-real-estate-response.mapper';
import { SearchResponse } from './search-response.interface';

export type ItemCardMapper<T> = (item: SearchResponse<T>) => ItemCard[];

const ItemCategoryIdMapper: Record<number, ItemCardMapper<any>> = {
  [CATEGORY_IDS.CAR]: SearchItemCarResponseMapper,
  [CATEGORY_IDS.REAL_ESTATE]: searchItemRealEstateResponseMapper,
};

export function SearchApiItemMapperFactory<T>(categoryId: string): ItemCardMapper<T>  {
  return ItemCategoryIdMapper[+categoryId] || SearchItemCustomerGoodsResponseMapper;
}

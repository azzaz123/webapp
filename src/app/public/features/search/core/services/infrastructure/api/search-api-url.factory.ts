import { CATEGORY_IDS } from '@core/category/category-ids';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FILTER_PARAMETERS_SEARCH } from '../../constants/filter-parameters';

const CategoryIdUrlMap: Record<number, string> = {
  [CATEGORY_IDS.CAR]: 'cars',
  [CATEGORY_IDS.REAL_ESTATE]: 'real_estate',
  [CATEGORY_IDS.FASHION_ACCESSORIES]: 'fashion'
};

const categoryIdDefault = 'general';

export function SearchApiUrlFactory(categoryId: string): string {
  return CategoryIdUrlMap[+categoryId] || categoryIdDefault;
}

export const wallParameters: string[] = [
  FILTER_PARAMETERS_SEARCH.CATEGORY_ID,
  FILTER_PARAMETERS_SEARCH.LATITUDE,
  FILTER_PARAMETERS_SEARCH.LONGITUDE,
  FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE
];



export function SearchApiUrlSearchOrWall(parameters: FilterParameter[]): string {
  const isWall: boolean = parameters.every(({key}: FilterParameter) => wallParameters.includes(key));
  return isWall ? 'wall' : 'search'
}

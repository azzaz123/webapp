import { CATEGORY_IDS } from '@core/category/category-ids';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

const CategoryIdUrlMap: Record<number, string> = {
  [CATEGORY_IDS.CAR]: 'cars',
  [CATEGORY_IDS.REAL_ESTATE]: 'real_estate',
  [CATEGORY_IDS.FASHION_ACCESSORIES]: 'fashion'
};

const categoryIdDefault = 'general';

export function SearchApiUrlFactory(categoryId: string): string {
  return CategoryIdUrlMap[+categoryId] || categoryIdDefault;
}


export const wallParameters: string[] = ['category_ids', 'latitude', 'longitude', 'filters_source'];

export function SearchApiUrlSearchOrWall(parameters: FilterParameter[]): string {
  const parametersAreOnWall = wallParameters
    .every((filterWall: string) => !!parameters.find(({key}: FilterParameter) => key === filterWall));
  const parametersLengthAreWall = parameters.length === wallParameters.length;
  return parametersAreOnWall && parametersLengthAreWall ? 'wall' : 'search';
}

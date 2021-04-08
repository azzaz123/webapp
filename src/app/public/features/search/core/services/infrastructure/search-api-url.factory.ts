import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
const CategoryIdUrlMap: Record<string, string> = {
  '100': 'cars',
  '200': 'real_estate',
  '12465': 'fashion'
};

const categoryIdDefault = 'general';

export function SearchApiUrlFactory(categoryId: string): string {
  return CategoryIdUrlMap[categoryId] || categoryIdDefault;
}


export const filtersWall: string[] = ['category_ids', 'latitude', 'longitude', 'filters_source', 'language'];
export function SearchApiUrlSearchOrWall(parameters: FilterParameter[]): string {
  const parametersAreOnWall = filtersWall.every((filterWall: string) => !!parameters.find(({key}: FilterParameter) => key === filterWall));
  const parametersLengthAreWall = parameters.length === filtersWall.length;
  return parametersAreOnWall && parametersLengthAreWall ? 'wall' : 'search';
}

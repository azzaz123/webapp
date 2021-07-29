import { CATEGORY_IDS } from '@core/category/category-ids';

const CategoryIdUrlMap: Record<number, string> = {
  [CATEGORY_IDS.CAR]: 'cars',
  [CATEGORY_IDS.REAL_ESTATE]: 'real_estate',
  [CATEGORY_IDS.FASHION_ACCESSORIES]: 'fashion'
};

const categoryIdDefault = 'general';

export function SearchApiUrlFactory(categoryId: string): string {
  return CategoryIdUrlMap[+categoryId] || categoryIdDefault;
}


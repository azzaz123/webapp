import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { CategoriesFilterParams } from './categories-filter-params.interface';
import { CategoriesFilterOption } from './categories-filter-option.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

export interface CategoriesFilterConfig extends FilterConfig<CategoriesFilterParams> {
  type: FILTER_TYPES.CATEGORIES;
  options: CategoriesFilterOption[];
}

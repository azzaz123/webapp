import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { CategoriesFilterParams } from './categories-filter-params.interface';
import { CategoriesFilterOption } from './categories-filter-option.interface';

export interface CategoriesFilterConfig extends FilterConfig<CategoriesFilterParams> {
  options: CategoriesFilterOption[];
}

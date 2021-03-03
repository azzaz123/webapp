import { FILTER_TYPES } from '../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from './filter-parameter.interface';

export interface FilterConfig<T extends Record<keyof T, string>> {
  id: string;
  title: string;
  icon?: string;
  isClearable?: boolean;
  actions?: {
    apply?: boolean;
  };
  bubblePlaceholder: string;
  drawerPlaceholder?: string;
  mapKey: T;
  defaultValue?: FilterParameter[];
  type: FILTER_TYPES;
}

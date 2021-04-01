import { FILTER_TYPES } from '../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from './filter-parameter.interface';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';

export interface FilterConfig<T extends Record<keyof T, string>> {
  id: ConfigurationId;
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

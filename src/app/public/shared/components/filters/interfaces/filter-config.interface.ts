import { FILTER_TYPES } from '../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from './filter-parameter.interface';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface FilterConfig<T extends Record<keyof T, FILTER_QUERY_PARAM_KEY>> {
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

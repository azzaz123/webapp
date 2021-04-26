import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface AbstractSelectFilterConfig<T extends Partial<Record<keyof T, FILTER_QUERY_PARAM_KEY>>> extends FilterConfig<T> {
  hasContentPlaceholder: boolean;
}

import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface FilterParameter {
  key: FILTER_QUERY_PARAM_KEY;
  value: string;
}

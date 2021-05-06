import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface RangeFilterParams {
  maxKey: FILTER_QUERY_PARAM_KEY;
  minKey: FILTER_QUERY_PARAM_KEY;
}

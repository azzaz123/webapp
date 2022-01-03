import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface GridSelectFilterParams {
  [key: string]: FILTER_QUERY_PARAM_KEY;
  parameterKey?: FILTER_QUERY_PARAM_KEY;
}

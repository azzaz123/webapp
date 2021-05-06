import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface SuggesterFilterParams {
  [key: string]: FILTER_QUERY_PARAM_KEY;
}

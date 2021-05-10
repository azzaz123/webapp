import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface SuggesterResponse {
  suggestion: string;
  vertical_id: string;
  prefix: string;
  category_id?: number;
  category_name?: string;
}

export interface SearchBoxValue {
  [FILTER_QUERY_PARAM_KEY.keywords]: string;
  [FILTER_QUERY_PARAM_KEY.categoryId]?: string;
}

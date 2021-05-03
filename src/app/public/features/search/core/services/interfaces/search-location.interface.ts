import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface SearchLocation {
  [FILTER_QUERY_PARAM_KEY.latitude]: string;
  [FILTER_QUERY_PARAM_KEY.longitude]: string;
}

export interface LabeledSearchLocation extends SearchLocation {
  label: string;
}

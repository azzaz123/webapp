import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface LocationFilterParams {
  distance: FILTER_QUERY_PARAM_KEY;
  latitude: FILTER_QUERY_PARAM_KEY;
  longitude: FILTER_QUERY_PARAM_KEY;
}

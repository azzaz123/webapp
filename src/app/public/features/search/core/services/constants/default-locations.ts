import { SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export const DEFAULT_LOCATIONS: Record<string, SearchLocation> = {
  es: {
    [FILTER_QUERY_PARAM_KEY.latitude]: '40.4893538',
    [FILTER_QUERY_PARAM_KEY.longitude]: '-3.6827461',
  },
  en: {
    [FILTER_QUERY_PARAM_KEY.latitude]: '51.509865',
    [FILTER_QUERY_PARAM_KEY.longitude]: '-0.118092',
  },
};

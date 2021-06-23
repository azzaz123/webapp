import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { APP_LOCALE } from 'configs/subdomains.config';

export const DEFAULT_LOCATIONS: Record<APP_LOCALE, LabeledSearchLocation> = {
  es: {
    [FILTER_QUERY_PARAM_KEY.latitude]: '40.4893538',
    [FILTER_QUERY_PARAM_KEY.longitude]: '-3.6827461',
    label: $localize`:@@web_default_location_madrid:Spain, Madrid`,
  },
  en: {
    [FILTER_QUERY_PARAM_KEY.latitude]: '51.509865',
    [FILTER_QUERY_PARAM_KEY.longitude]: '-0.118092',
    label: $localize`:@@web_default_location_london:United Kingdom, London`,
  },
  it: {
    [FILTER_QUERY_PARAM_KEY.latitude]: '41.8905',
    [FILTER_QUERY_PARAM_KEY.longitude]: '12.4942',
    label: $localize`:@@web_default_location_roma:Italia, Roma`,
  },
};

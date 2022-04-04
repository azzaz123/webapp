import { CATEGORY_IDS } from '@core/category/category-ids';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FILTER_PARAMETERS_SEARCH } from './filter-parameters';

export const CATEGORY_CARDS_VISIBILITY_RULES = {
  ALLOWED_PARAMETER_KEYS: [
    FILTER_QUERY_PARAM_KEY.categoryId,
    FILTER_QUERY_PARAM_KEY.objectType,
    FILTER_QUERY_PARAM_KEY.orderBy,
    FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE,
    FILTER_PARAMETERS_SEARCH.LATITUDE,
    FILTER_PARAMETERS_SEARCH.LONGITUDE,
  ],
  REQUIRED_PARAMETER_KEYS: [FILTER_QUERY_PARAM_KEY.categoryId],
  NOT_ALLOWED_PARAMETER_VALUES: {
    [FILTER_QUERY_PARAM_KEY.categoryId]: [CATEGORY_IDS.CAR, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.MOTORBIKE],
  },
};

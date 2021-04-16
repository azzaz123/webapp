import { FilterGroupConfig } from '@public/shared/services/filter-configuration/interfaces/filter-group-config.interface';
import { DEFAULT_FILTER_CONFIGURATION } from '../../../components/filters/core/constants/filter-configuration-by-category/default/default-filter-configuration';
import { CAR_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/car/car-filter-configuration';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { REAL_ESTATE_FILTER_CONFIGURATION } from '@public/shared/components/filters/core/constants/filter-configuration-by-category/real-estate/real-estate-filter-configuration';

export const FILTER_GROUP_CONFIG: FilterGroupConfig[] = [
  {
    config: DEFAULT_FILTER_CONFIGURATION,
    params: [],
  },
  {
    config: CAR_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.CAR.toString(),
      },
    ],
  },
  {
    config: REAL_ESTATE_FILTER_CONFIGURATION,
    params: [
      {
        key: FILTER_QUERY_PARAM_KEY.categoryId,
        value: CATEGORY_IDS.REAL_ESTATE.toString(),
      },
    ],
  },
];

import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { CATEGORY_OPTIONS } from '../../../../components/categories-filter/data/category_options';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export const COMMON_FILTERS: AvailableFilterConfig[] = [
  {
    id: COMMON_CONFIGURATION_ID.CATEGORIES,
    title: $localize`:@@filterCategoriesTitle:Category`,
    bubblePlaceholder: $localize`:@@filterCategoriesPlaceholder:All categories`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.categoryId,
    },
    options: CATEGORY_OPTIONS,
    type: FILTER_TYPES.CATEGORIES,
  },
  {
    id: COMMON_CONFIGURATION_ID.POSTED_AGO,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@filterTimeOfListing:Time of listing`,
    bubblePlaceholder: $localize`:@@filterTimeOfListing:Time of listing`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.postedAgo,
    },
    hasBigIcons: true,
    isMultiselect: false,
  },
];

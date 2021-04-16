import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { CATEGORY_OPTIONS } from '../../../../components/categories-filter/data/category_options';

export const COMMON_FILTERS: AvailableFilterConfig[] = [
  {
    id: COMMON_CONFIGURATION_ID.CATEGORIES,
    title: $localize`:@@filterCategoriesTitle:Category`,
    bubblePlaceholder: $localize`:@@filterCategoriesPlaceholder:All categories`,
    mapKey: {
      parameterKey: 'category_ids',
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
      parameterKey: 'time_filter',
    },
    hasBigIcons: true,
    isMultiselect: false,
  },
];

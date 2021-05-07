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
  {
    id: COMMON_CONFIGURATION_ID.PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    icon: '/assets/icons/filters/price.svg',
    units: '€',
    range: [0, 20000],
    stepsConfig: [
      { range: [0, 50], step: 1 },
      { range: [50, 100], step: 5 },
      { range: [100, 300], step: 10 },
      { range: [300, 500], step: 50 },
      { range: [500, 1000], step: 100 },
      { range: [1000, 3000], step: 250 },
      { range: [3000, 5000], step: 500 },
      { range: [5000, 10000], step: 1000 },
      { range: [10000, 20000], step: 2500 },
    ],
    limitless: true,
  },
  {
    id: COMMON_CONFIGURATION_ID.CONDITION,
    type: FILTER_TYPES.SELECT,
    title: $localize`:@@filterConditionTitle:Item condition`,
    bubblePlaceholder: $localize`:@@filterConditionBubblePlaceholder:Item condition`,
    drawerPlaceholder: $localize`:@@filterConditionDrawerPlaceholder:Any item condition`,
    icon: '/assets/icons/filters/condition.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.condition,
    },
    isClearable: true,
    hasContentPlaceholder: true,
  },
  {
    id: COMMON_CONFIGURATION_ID.LOCATION,
    type: FILTER_TYPES.LOCATION,
    title: $localize`:@@filterLocationTitle:Where?`,
    bubblePlaceholder: $localize`:@@filterLocationBubblePlaceholder:Location`,
    drawerPlaceholder: $localize`:@@filterLocationDrawerPlaceholder:Any location`,
    icon: '/assets/icons/filters/location.svg',
    mapKey: {
      latitude: FILTER_QUERY_PARAM_KEY.latitude,
      longitude: FILTER_QUERY_PARAM_KEY.longitude,
      distance: FILTER_QUERY_PARAM_KEY.distance,
    },
    units: 'km',
    range: [0, 500],
    stepsConfig: [
      { range: [0, 10], step: 5 },
      { range: [10, 50], step: 20 },
      { range: [50, 100], step: 50 },
      { range: [100, 200], step: 100 },
      { range: [200, 500], step: 300 },
    ],
    limitless: true,
    hasContentPlaceholder: true,
  },
];

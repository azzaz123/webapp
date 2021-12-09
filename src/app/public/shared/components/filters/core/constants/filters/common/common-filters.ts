import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { COMMON_CONFIGURATION_ID } from '../../../enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { MULTISELECT_FILTER_BUBBLE_VARIANT } from '@public/shared/components/filters/components/multi-select-filter/enum/multi-select-filter-bubble-variant.enum';

export const COMMON_FILTERS: AvailableFilterConfig[] = [
  {
    id: COMMON_CONFIGURATION_ID.CATEGORIES,
    title: $localize`:@@web_filter_categories_title:Category`,
    bubblePlaceholder: $localize`:@@web_filter_categories_placeholder:All categories`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.categoryId,
    },
    options: [],
    type: FILTER_TYPES.CATEGORIES,
  },
  {
    id: COMMON_CONFIGURATION_ID.POSTED_AGO,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_time_of_listing:Time of listing`,
    bubblePlaceholder: $localize`:@@web_filter_time_of_listing:Time of listing`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.postedAgo,
    },
    hasBigIcons: true,
    isMultiselect: false,
    gridColumns: 4,
  },
  {
    id: COMMON_CONFIGURATION_ID.PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
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
    type: FILTER_TYPES.MULTISELECT,
    title: $localize`:@@web_filter_condition_title:Item condition`,
    bubblePlaceholder: $localize`:@@web_filter_condition_bubble_placeholder:Item condition`,
    drawerPlaceholder: $localize`:@@web_filter_condition_drawer_placeholder:Any item condition`,
    icon: '/assets/icons/filters/condition.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.condition,
    },
    isClearable: true,
    hasContentPlaceholder: true,
    bubbleVariant: MULTISELECT_FILTER_BUBBLE_VARIANT.SINGLE,
    singleBubbleValueLabel: $localize`:@@quick_filter_n_conditions:${1}:INTERPOLATION:conditions`,
  },
  {
    id: COMMON_CONFIGURATION_ID.LOCATION,
    type: FILTER_TYPES.LOCATION,
    title: $localize`:@@web_filter_location_title:Where?`,
    bubblePlaceholder: $localize`:@@web_filter_location_bubble_placeholder:Location`,
    drawerPlaceholder: $localize`:@@web_filter_location_drawer_placeholder:Any location`,
    icon: '/assets/icons/filters/location.svg',
    mapKey: {
      latitude: FILTER_QUERY_PARAM_KEY.latitude,
      longitude: FILTER_QUERY_PARAM_KEY.longitude,
      distance: FILTER_QUERY_PARAM_KEY.distance,
    },
    units: 'km',
    range: [1, 500],
    stepsConfig: [
      { range: [1, 4], step: 4 },
      { range: [5, 9], step: 5 },
      { range: [10, 49], step: 20 },
      { range: [50, 99], step: 50 },
      { range: [100, 199], step: 100 },
      { range: [200, 500], step: 300 },
    ],
    mapZoomValue: [
      { distance: 1, zoom: 13 },
      { distance: 5, zoom: 11 },
      { distance: 10, zoom: 10 },
      { distance: 30, zoom: 8 },
      { distance: 50, zoom: 8 },
      { distance: 100, zoom: 6 },
      { distance: 200, zoom: 6 },
      { distance: 500, zoom: 6 },
    ],
    limitless: true,
    hasContentPlaceholder: true,
  },
];

import { REAL_ESTATE_CONFIGURATION_ID } from '../../../enums/configuration-ids/real-estate-configuration-ids.enum';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

const REAL_ESTATE_FILTER_CONFIGURATION_COMMON: AvailableFilterConfig[] = [
  {
    id: REAL_ESTATE_CONFIGURATION_ID.ROOMS,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_rooms_title:Number of rooms`,
    bubblePlaceholder: $localize`:@@web_filter_rooms_bubble_placeholder:Number of rooms`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.rooms,
    },
    isMultiselect: false,
    hasBigIcons: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BATHROOMS,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_bathrooms_title:Number of bathrooms`,
    bubblePlaceholder: $localize`:@@web_filter_bathrooms_bubble_placeholder:Number of bathrooms`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.bathrooms,
    },
    isMultiselect: false,
    hasBigIcons: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.CONDITION,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_real_estate_condition_title:Status`,
    bubblePlaceholder: $localize`:@@web_filter_real_estate_condition_bubble_placeholder:Status`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.condition,
    },
    isMultiselect: false,
    hasBigIcons: false,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.EXTRAS,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_real_estate_features_title:Features`,
    bubblePlaceholder: $localize`:@@web_filter_real_estate_features_bubble_placeholder:Features`,
    mapKey: {
      garage: FILTER_QUERY_PARAM_KEY.garage,
      terrace: FILTER_QUERY_PARAM_KEY.terrace,
      elevator: FILTER_QUERY_PARAM_KEY.elevator,
      garden: FILTER_QUERY_PARAM_KEY.garden,
      pool: FILTER_QUERY_PARAM_KEY.pool,
    },
    isMultiselect: true,
    hasBigIcons: false,
    isBooleanFormat: true,
  },
];

const REAL_ESTATE_FILTER_CONFIGURATION_DEFAULT: AvailableFilterConfig[] = [
  {
    id: REAL_ESTATE_CONFIGURATION_ID.TYPE,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_property_type_title:What are you looking for?`,
    bubblePlaceholder: $localize`:@@web_filter_property_type_bubble_placeholder:Type of property`,
    icon: '/assets/icons/filters/real_estate_type.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.type,
    },
    isMultiselect: false,
    hasBigIcons: false,
    mirrorsValueIcon: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.OPERATION,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_operation_title:Rent or buy?`,
    bubblePlaceholder: $localize`:@@web_filter_operation_bubble_placeholder:Rent or buy?`,
    icon: '/assets/icons/filters/real_estate_operation.svg',
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.operation,
    },
    isMultiselect: false,
    hasBigIcons: false,
    mirrorsValueIcon: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.DEFAULT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 5000000],
    stepsConfig: [
      { range: [0, 1000], step: 100 },
      { range: [1000, 10000], step: 500 },
      { range: [10000, 50000], step: 5000 },
      { range: [50000, 5000000], step: 50000 },
    ],
    limitless: true,
  },
];

const REAL_ESTATE__FILTER_CONFIGURATION_BUY_PRICE: AvailableFilterConfig[] = [
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_BOX_ROOM_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 100000],
    stepsConfig: [{ range: [0, 100000], step: 1000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_DEFAULT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 5000000],
    stepsConfig: [
      { range: [0, 1000], step: 100 },
      { range: [1000, 10000], step: 500 },
      { range: [10000, 50000], step: 5000 },
      { range: [50000, 5000000], step: 50000 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_FLAT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000000],
    stepsConfig: [
      { range: [0, 50000], step: 50000 },
      { range: [50000, 3000000], step: 25000 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_GARAGE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 100000],
    stepsConfig: [{ range: [0, 100000], step: 1000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_HOUSE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000000],
    stepsConfig: [
      { range: [0, 50000], step: 50000 },
      { range: [50000, 3000000], step: 25000 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_LAND_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000000],
    stepsConfig: [
      { range: [0, 50000], step: 50000 },
      { range: [50000, 3000000], step: 25000 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_OFFICE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000000],
    stepsConfig: [
      { range: [0, 50000], step: 50000 },
      { range: [50000, 3000000], step: 25000 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_OFFICE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000000],
    stepsConfig: [
      { range: [0, 50000], step: 50000 },
      { range: [50000, 3000000], step: 25000 },
    ],
    limitless: true,
  },
];

const REAL_ESTATE__FILTER_CONFIGURATION_RENT_PRICE: AvailableFilterConfig[] = [
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_BOX_ROOM_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 1000],
    stepsConfig: [{ range: [0, 1000], step: 10 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_DEFAULT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 5000000],
    stepsConfig: [
      { range: [0, 1000], step: 100 },
      { range: [1000, 10000], step: 500 },
      { range: [10000, 50000], step: 5000 },
      { range: [50000, 5000000], step: 50000 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_FLAT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000],
    stepsConfig: [{ range: [0, 3000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_GARAGE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 700],
    stepsConfig: [{ range: [0, 700], step: 25 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_HOUSE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 3000],
    stepsConfig: [{ range: [0, 3000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_LAND_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 30000],
    stepsConfig: [{ range: [0, 30000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_OFFICE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 30000],
    stepsConfig: [{ range: [0, 30000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_ROOM_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_price_title:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@web_filter_price_bubble_placeholder:Price`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minPrice,
      maxKey: FILTER_QUERY_PARAM_KEY.maxPrice,
    },
    units: '€',
    range: [0, 1000],
    stepsConfig: [{ range: [0, 1000], step: 50 }],
    limitless: true,
  },
];

const REAL_ESTATE__FILTER_CONFIGURATION_SURFACE: AvailableFilterConfig[] = [
  {
    id: REAL_ESTATE_CONFIGURATION_ID.FLAT_SURFACE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_surface_title:Surface`,
    icon: '/assets/icons/filters/surface.svg',
    bubblePlaceholder: $localize`:@@web_filter_surface_bubble_placeholder:Surface`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minSurface,
      maxKey: FILTER_QUERY_PARAM_KEY.maxSurface,
    },
    units: 'm²',
    range: [0, 1000],
    stepsConfig: [{ range: [0, 1000], step: 20 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.LAND_SURFACE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_surface_title:Surface`,
    icon: '/assets/icons/filters/surface.svg',
    bubblePlaceholder: $localize`:@@web_filter_surface_bubble_placeholder:Surface`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minSurface,
      maxKey: FILTER_QUERY_PARAM_KEY.maxSurface,
    },
    units: 'm²',
    range: [0, 10000],
    stepsConfig: [{ range: [0, 1000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.HOUSE_SURFACE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_surface_title:Surface`,
    icon: '/assets/icons/filters/surface.svg',
    bubblePlaceholder: $localize`:@@web_filter_surface_bubble_placeholder:Surface`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minSurface,
      maxKey: FILTER_QUERY_PARAM_KEY.maxSurface,
    },
    units: 'm²',
    range: [0, 1000],
    stepsConfig: [
      { range: [0, 40], step: 40 },
      { range: [40, 1000], step: 20 },
    ],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.OFFICE_SURFACE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_surface_title:Surface`,
    icon: '/assets/icons/filters/surface.svg',
    bubblePlaceholder: $localize`:@@web_filter_surface_bubble_placeholder:Surface`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minSurface,
      maxKey: FILTER_QUERY_PARAM_KEY.maxSurface,
    },
    units: 'm²',
    range: [0, 1000],
    stepsConfig: [{ range: [0, 1000], step: 50 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BOX_ROOM_SURFACE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_surface_title:Surface`,
    icon: '/assets/icons/filters/surface.svg',
    bubblePlaceholder: $localize`:@@web_filter_surface_bubble_placeholder:Surface`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minSurface,
      maxKey: FILTER_QUERY_PARAM_KEY.maxSurface,
    },
    units: 'm²',
    range: [0, 200],
    stepsConfig: [{ range: [0, 200], step: 2 }],
    limitless: true,
  },
];

export const REAL_ESTATE__FILTERS: AvailableFilterConfig[] = [
  ...REAL_ESTATE_FILTER_CONFIGURATION_DEFAULT,
  ...REAL_ESTATE_FILTER_CONFIGURATION_COMMON,
  ...REAL_ESTATE__FILTER_CONFIGURATION_BUY_PRICE,
  ...REAL_ESTATE__FILTER_CONFIGURATION_RENT_PRICE,
  ...REAL_ESTATE__FILTER_CONFIGURATION_SURFACE,
];

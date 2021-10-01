import { CAR_CONFIGURATION_ID } from '../../../enums/configuration-ids/car-configuration-ids.enum';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export const CAR_FILTERS: AvailableFilterConfig[] = [
  {
    id: CAR_CONFIGURATION_ID.PRICE,
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
    stepsConfig: [
      { range: [0, 30000], step: 1000 },
      { range: [30000, 50000], step: 5000 },
      { range: [50000, 100000], step: 10000 },
    ],
    limitless: true,
  },
  {
    id: CAR_CONFIGURATION_ID.BRAND_N_MODEL,
    type: FILTER_TYPES.SUGGESTER,
    title: $localize`:@@web_filter_cars_brand_model_title:Brand and Model`,
    bubblePlaceholder: $localize`:@@web_filter_cars_brand_model_bubble_placeholder:Brand and Model`,
    suggesterPlaceholder: $localize`:@@web_filter_cars_brand_model_suggester_placeholder:Looking for a certain brand?`,
    drawerPlaceholder: $localize`:@@web_filter_cars_brand_model_drawer_placeholder:Select brand and model`,
    icon: '/assets/icons/filters/brand_model.svg',
    mapKey: {
      brand: FILTER_QUERY_PARAM_KEY.brand,
      model: FILTER_QUERY_PARAM_KEY.model,
    },
    hasContentPlaceholder: true,
    isClearable: true,
    hasOptionsOnInit: false,
    isLabelInValue: true,
  },
  {
    id: CAR_CONFIGURATION_ID.YEAR,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_year_title:Registration date`,
    icon: '/assets/icons/filters/calendar.svg',
    bubblePlaceholder: $localize`:@@web_filter_year_bubble_placeholder:Year`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minYear,
      maxKey: FILTER_QUERY_PARAM_KEY.maxYear,
    },
    range: [1978, new Date().getFullYear()],
  },
  {
    id: CAR_CONFIGURATION_ID.KM,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_mileage_title:Mileage`,
    icon: '/assets/icons/filters/km.svg',
    bubblePlaceholder: $localize`:@@web_filter_mileage_bubble_placeholder:Km`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minKm,
      maxKey: FILTER_QUERY_PARAM_KEY.maxKm,
    },
    units: 'km',
    range: [0, 300000],
    stepsConfig: [
      { range: [0, 10000], step: 1000 },
      { range: [10000, 30000], step: 5000 },
      { range: [30000, 100000], step: 10000 },
      { range: [100000, 300000], step: 50000 },
    ],
    limitless: true,
  },
  {
    id: CAR_CONFIGURATION_ID.PROFESSIONAL,
    type: FILTER_TYPES.TOGGLE,
    icon: '/assets/icons/filters/professional.svg',
    title: '',
    bubblePlaceholder: $localize`:@@web_filter_professional_bubble_placeholder:Only professionals`,
    mapKey: {
      key: FILTER_QUERY_PARAM_KEY.professional,
    },
  },
  {
    id: CAR_CONFIGURATION_ID.WARRANTY,
    type: FILTER_TYPES.TOGGLE,
    title: $localize`:@@web_filter_warranty_title:Cars with warranty`,
    icon: '/assets/icons/filters/warranty.svg',
    bubblePlaceholder: $localize`:@@web_filter_warranty_bubble_placeholder:Warranty`,
    mapKey: {
      key: FILTER_QUERY_PARAM_KEY.warranty,
    },
  },
  {
    id: CAR_CONFIGURATION_ID.SEATS,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_num_of_seats_title:Number of seats`,
    bubblePlaceholder: $localize`:@@web_filter_num_of_seats_bubble_placeholder:Number of seats`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minSeats,
      maxKey: FILTER_QUERY_PARAM_KEY.maxSeats,
    },
    range: [1, 9],
    limitless: true,
  },
  {
    id: CAR_CONFIGURATION_ID.DOORS,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_num_of_doors_title:Number of doors`,
    bubblePlaceholder: $localize`:@@web_filter_num_of_doors_bubble_placeholder:Number of doors`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minDoors,
      maxKey: FILTER_QUERY_PARAM_KEY.maxDoors,
    },
    range: [2, 6],
    limitless: true,
  },
  {
    id: CAR_CONFIGURATION_ID.HORSE_POWER,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@web_filter_horse_power_title:Horse power`,
    bubblePlaceholder: $localize`:@@web_filter_horse_power_bubble_placeholder:Horse power`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minHorsePower,
      maxKey: FILTER_QUERY_PARAM_KEY.maxHorsePower,
    },
    units: 'cv',
    range: [0, 500],
    stepsConfig: [
      { range: [0, 100], step: 10 },
      { range: [100, 500], step: 50 },
    ],
    limitless: true,
  },
  {
    id: CAR_CONFIGURATION_ID.BODY,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_body_type_title:Type of car`,
    bubblePlaceholder: $localize`:@@web_filter_body_type_placeholder:Type of car`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.bodyType,
    },
    hasBigIcons: false,
    isMultiselect: true,
    gridColumns: 3,
  },
  {
    id: CAR_CONFIGURATION_ID.ENGINE,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_engine_type_title:Engine type`,
    bubblePlaceholder: $localize`:@@web_filter_engine_type_placeholder:Engine type`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.engine,
    },
    hasBigIcons: false,
    isMultiselect: true,
    gridColumns: 3,
  },
  {
    id: CAR_CONFIGURATION_ID.GEARBOX,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@web_filter_gearbox_type_title:Gear box`,
    bubblePlaceholder: $localize`:@@web_filter_gearbox_type_placeholder:Gear box`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.gearbox,
    },
    hasBigIcons: false,
    isMultiselect: true,
    gridColumns: 6,
  },
];

import { CAR_CONFIGURATION_ID } from '../../../enums/configuration-ids/car-configuration-ids.enum';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../../../types/available-filter-config.type';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export const CAR_FILTERS: AvailableFilterConfig[] = [
  {
    id: CAR_CONFIGURATION_ID.PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
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
    title: $localize`:@@filterCarsBrandModelTitle:Brand and Model`,
    bubblePlaceholder: $localize`:@@filterCarsBrandModelBubblePlaceholder:Brand and Model`,
    suggesterPlaceholder: $localize`:@@filterCarsBrandModelSuggesterPlaceholder:Looking for a certain brand?`,
    drawerPlaceholder: $localize`:@@filterCarsBrandModelDrawerPlaceholder:Select brand and model`,
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
    title: $localize`:@@filterYearTitle:Registration date`,
    icon: '/assets/icons/filters/calendar.svg',
    bubblePlaceholder: $localize`:@@filterYearBubblePlaceholder:Year`,
    mapKey: {
      minKey: FILTER_QUERY_PARAM_KEY.minYear,
      maxKey: FILTER_QUERY_PARAM_KEY.maxYear,
    },
    range: [1978, new Date().getFullYear()],
  },
  {
    id: CAR_CONFIGURATION_ID.KM,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterMileageTitle:Mileage`,
    icon: '/assets/icons/filters/km.svg',
    bubblePlaceholder: $localize`:@@filterMileageBubblePlaceholder:Km`,
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
    bubblePlaceholder: $localize`:@@filterProfessionalBubblePlaceholder:Only professionals`,
    mapKey: {
      key: FILTER_QUERY_PARAM_KEY.professional,
    },
  },
  {
    id: CAR_CONFIGURATION_ID.WARRANTY,
    type: FILTER_TYPES.TOGGLE,
    title: $localize`:@@filterWarrantyTitle:Cars with warranty`,
    icon: '/assets/icons/filters/warranty.svg',
    bubblePlaceholder: $localize`:@@filterWarrantyBubblePlaceholder:Warranty`,
    mapKey: {
      key: FILTER_QUERY_PARAM_KEY.warranty,
    },
  },
  {
    id: CAR_CONFIGURATION_ID.SEATS,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterNumOfSeatsTitle:Number of seats`,
    bubblePlaceholder: $localize`:@@filterNumOfSeatsBubblePlaceholder:Number of seats`,
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
    title: $localize`:@@filterNumOfDoorsTitle:Number of doors`,
    bubblePlaceholder: $localize`:@@filterNumOfDoorsBubblePlaceholder:Number of doors`,
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
    title: $localize`:@@filterHorsePowerTitle:Horse power`,
    bubblePlaceholder: $localize`:@@filterHorsePowerBubblePlaceholder:Horse power`,
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
    title: $localize`:@@filterBodyTypeTitle:Type of car`,
    bubblePlaceholder: $localize`:@@filterBodyTypePlaceholder:Type of car`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.bodyType,
    },
    hasBigIcons: false,
    isMultiselect: true,
  },
  {
    id: CAR_CONFIGURATION_ID.ENGINE,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@filterEngineTypeTitle:Engine type`,
    bubblePlaceholder: $localize`:@@filterEngineTypePlaceholder:Engine type`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.engine,
    },
    hasBigIcons: false,
    isMultiselect: true,
  },
  {
    id: CAR_CONFIGURATION_ID.GEARBOX,
    type: FILTER_TYPES.GRID,
    title: $localize`:@@filterGearboxTypeTitle:Gear box`,
    bubblePlaceholder: $localize`:@@filterGearboxTypePlaceholder:Gear box`,
    mapKey: {
      parameterKey: FILTER_QUERY_PARAM_KEY.gearbox,
    },
    hasBigIcons: false,
    isMultiselect: true,
  },
];

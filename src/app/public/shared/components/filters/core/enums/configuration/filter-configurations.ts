import { RangeFilterConfig } from '../../../components/range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../../../components/toggle-filter/interfaces/toggle-filter-config.interface';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { CAR_CONFIGURATION_ID } from '../configuration-ids/car-configuration-ids';
import { FILTER_TYPES } from '../filter-types/filter-types.enum';

export type FilterConfigType = RangeFilterConfig | ToggleFilterConfig; // TODO NO LO USO, QUIERO ALGO ASÍ PARA EL ANY

export const FILTER_CONFIGURATIONS: FilterConfigType[] = [
  // TODO ESE ANY NO ME GUSTA
  // CARS
  {
    id: CAR_CONFIGURATION_ID.PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
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
    id: CAR_CONFIGURATION_ID.YEAR,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterYearTitle:Registration date`,
    icon: '/assets/icons/filters/calendar.svg',
    bubblePlaceholder: $localize`:@@filterYearBubblePlaceholder:Year`,
    mapKey: {
      minKey: 'min_year',
      maxKey: 'max_year',
    },
    range: [1978, new Date().getFullYear()],
  },
  {
    id: CAR_CONFIGURATION_ID.KM,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterYearTitle:Mileage`,
    icon: '/assets/icons/filters/km.svg',
    bubblePlaceholder: $localize`:@@filterYearBubblePlaceholder:Km`,
    mapKey: {
      minKey: 'min_km',
      maxKey: 'max_km',
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
      key: 'professional',
    },
  },
  {
    id: CAR_CONFIGURATION_ID.WARRANTY,
    type: FILTER_TYPES.TOGGLE,
    title: $localize`:@@filterWarrantyTitle:Cars with warranty`,
    icon: '/assets/icons/filters/warranty.svg',
    bubblePlaceholder: $localize`:@@filterWarrantyBubblePlaceholder:Warranty`,
    mapKey: {
      key: 'warranty',
    },
  },
];

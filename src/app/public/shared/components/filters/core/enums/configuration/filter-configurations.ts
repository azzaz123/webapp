import { RangeFilterConfig } from '../../../components/range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../../../components/toggle-filter/interfaces/toggle-filter-config.interface';
import { CAR_CONFIGURATION_ID } from '../configuration-ids/car-configuration-ids';
import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../configuration-ids/consumer-goods-configuration-ids.enum';
import { REAL_ESTATE_CONFIGURATION_ID } from '../configuration-ids/real-estate-configuration-ids.enum';
import { FILTER_TYPES } from '../filter-types/filter-types.enum';

type FilterConfigType = RangeFilterConfig | ToggleFilterConfig;

export const FILTER_CONFIGURATIONS: FilterConfigType[] = [
  // TODO ESE ANY NO ME GUSTA
  // COMMON
  {
    id: COMMON_CONSUMER_GOODS_CONFIGURATION_ID.PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
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
      { range: [10000, 20000], step: 1250 },
    ],
    limitless: true,
  },
  // CARS
  // -PRICE
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
  // REAL_ESTATE
  // -PRICE
  {
    id: REAL_ESTATE_CONFIGURATION_ID.DEFAULT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
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
  // --BUY
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_BOX_ROOM_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [1000, 100000],
    stepsConfig: [{ range: [1000, 100000], step: 1000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_DEFAULT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
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
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [50000, 3000000],
    stepsConfig: [{ range: [50000, 3000000], step: 25000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_GARAGE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [1000, 100000],
    stepsConfig: [{ range: [1000, 100000], step: 1000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_HOUSE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [50000, 3000000],
    stepsConfig: [{ range: [50000, 3000000], step: 25000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_LAND_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [50000, 3000000],
    stepsConfig: [{ range: [50000, 3000000], step: 25000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_OFFICE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [50000, 3000000],
    stepsConfig: [{ range: [50000, 3000000], step: 25000 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.BUY_OFFICE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [50000, 3000000],
    stepsConfig: [{ range: [50000, 3000000], step: 25000 }],
    limitless: true,
  },
  // --RENT
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_BOX_ROOM_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [10, 1000],
    stepsConfig: [{ range: [10, 1000], step: 10 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_DEFAULT_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
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
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [100, 3000],
    stepsConfig: [{ range: [100, 3000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_GARAGE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [25, 700],
    stepsConfig: [{ range: [25, 700], step: 25 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_HOUSE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [100, 3000],
    stepsConfig: [{ range: [100, 3000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_LAND_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [100, 30000],
    stepsConfig: [{ range: [100, 30000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_OFFICE_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [100, 30000],
    stepsConfig: [{ range: [100, 30000], step: 100 }],
    limitless: true,
  },
  {
    id: REAL_ESTATE_CONFIGURATION_ID.RENT_ROOM_PRICE,
    type: FILTER_TYPES.RANGE,
    title: $localize`:@@filterPriceTitle:How much?`,
    icon: '/assets/icons/filters/price.svg',
    bubblePlaceholder: $localize`:@@filterPriceBubblePlaceholder:Price`,
    mapKey: {
      minKey: 'min_sale_price',
      maxKey: 'max_sale_price',
    },
    units: '€',
    range: [50, 1000],
    stepsConfig: [{ range: [50, 1000], step: 50 }],
    limitless: true,
  },
];

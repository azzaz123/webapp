import { COMMON_CONSUMER_GOODS_CONFIGURATION_ID } from '../../../enums/configuration-ids/consumer-goods-configuration-ids.enum';
import { FILTER_TYPES } from '../../../enums/filter-types/filter-types.enum';
import { AvailableFilterConfig } from '../filter-configurations';

export const CONSUMER_GOODS_FILTERS: AvailableFilterConfig[] = [
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
];

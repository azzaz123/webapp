import { CAR_FILTERS } from './car/car-filters';
import { REAL_ESTATE__FILTERS } from './real-estate/real-estate-filters';
import { CONSUMER_GOODS_FILTERS } from './consumer-goods/consumer-goods-filters';
import { AvailableFilterConfig } from '../../types/available-filter-config.type';
import { COMMON_FILTERS } from './common/common-filters';
import { FASHION_FILTERS } from './fashion/fashion-filters';
import { PHONE_N_ACCESSORIES_FILTERS } from './phone_n_accessories/phone-n-accessories-filters';

export const FILTER_CONFIGURATIONS: AvailableFilterConfig[] = [
  ...COMMON_FILTERS,
  ...CONSUMER_GOODS_FILTERS,
  ...CAR_FILTERS,
  ...REAL_ESTATE__FILTERS,
  ...FASHION_FILTERS,
  ...PHONE_N_ACCESSORIES_FILTERS,
];

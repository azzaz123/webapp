import { CAR_FILTERS } from './car/car-filters';
import { REAL_ESTATE__FILTERS } from './real-estate/real-estate-filters';
import { CONSUMER_GOODS_FILTERS } from './consumer-goods/consumer-goods-filters';
import { AvailableFilterConfig } from '../../types/available-filter-config.type';

export const FILTER_CONFIGURATIONS: AvailableFilterConfig[] = [...CONSUMER_GOODS_FILTERS, ...CAR_FILTERS, ...REAL_ESTATE__FILTERS];

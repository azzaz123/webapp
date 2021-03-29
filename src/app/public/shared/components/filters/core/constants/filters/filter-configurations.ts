import { RangeFilterConfig } from '../../../components/range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../../../components/toggle-filter/interfaces/toggle-filter-config.interface';
import { CAR_FILTERS } from './car/car-filters';
import { REAL_ESTATE__FILTERS } from './real-estate/real-estate-filters';
import { CONSUMER_GOODS_FILTERS } from './consumer-goods/consumer-goods-filters';

export type FilterConfigType = RangeFilterConfig | ToggleFilterConfig;

export const FILTER_CONFIGURATIONS: FilterConfigType[] = [...CONSUMER_GOODS_FILTERS, ...CAR_FILTERS, ...REAL_ESTATE__FILTERS];

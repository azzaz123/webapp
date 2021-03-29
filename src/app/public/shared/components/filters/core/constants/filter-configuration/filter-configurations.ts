import { RangeFilterConfig } from '../../../components/range-filter/interfaces/range-filter-config.interface';
import { ToggleFilterConfig } from '../../../components/toggle-filter/interfaces/toggle-filter-config.interface';
import { CARS_FILTER_CONFIGURATION } from './cars/cars-filter-configuration';
import { CONSUMER_GOODS_FILTER_CONFIGURATIONS } from './consumer-goods/consumer-goods-filter-configuration';

export type FilterConfigType = RangeFilterConfig | ToggleFilterConfig;

export const FILTER_CONFIGURATIONS: FilterConfigType[] = [
  ...CONSUMER_GOODS_FILTER_CONFIGURATIONS,
  ...CARS_FILTER_CONFIGURATION,
  ...REAL_ESTATE__FILTER_CONFIGURATION,
];

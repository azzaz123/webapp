import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BubbleDrawerConfiguration } from '@public/shared/components/filters/core/interfaces/bubble-drawer-configuration.interface';

export interface FilterGroupConfig {
  params: FilterParameter[];
  config: BubbleDrawerConfiguration;
}

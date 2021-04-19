import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BubbleDrawerConfiguration } from '@public/shared/components/filters/core/interfaces/bubble-drawer-configuration.interface';
import { FILTER_GROUP_ID } from '../enum/filter-group-id.enum';

export interface FilterWrapperConfiguration {
  id: FILTER_GROUP_ID;
  params: FilterParameter[];
  config: BubbleDrawerConfiguration;
}

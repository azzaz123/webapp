import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterWrapperConfiguration } from '@public/shared/components/filters/core/interfaces/filter-wrapper-configuration.interface';

export interface FilterGroupConfig {
  params: FilterParameter[];
  config: FilterWrapperConfiguration;
}

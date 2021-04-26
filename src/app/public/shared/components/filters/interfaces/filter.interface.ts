import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { EventEmitter } from '@angular/core';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

export interface Filter<T extends Record<keyof T, FILTER_QUERY_PARAM_KEY>> {
  // Inputs
  variant: FILTER_VARIANT;
  config: FilterConfig<T>;
  value: FilterParameter[];

  // Outputs
  valueChange: EventEmitter<FilterParameter[]>;
  openStateChange: EventEmitter<boolean>;
}

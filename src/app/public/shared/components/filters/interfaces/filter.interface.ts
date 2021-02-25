import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { EventEmitter } from '@angular/core';

export interface Filter<T extends Record<keyof T, string>> {
  // Inputs
  variant: FILTER_VARIANT;
  config: FilterConfig<T>;
  value: FilterParameter[];

  // Outputs
  change: EventEmitter<FilterParameter[]>;
  clear: EventEmitter<void>;
  openStateChange: EventEmitter<boolean>;
}

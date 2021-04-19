import { ComponentFactory } from '@angular/core';
import { AbstractFilter } from '../../../../abstract-filter/abstract-filter';
import { FILTER_VARIANT } from '../../../../abstract-filter/abstract-filter.enum';
import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';

export interface FilterHostConfig {
  factory: ComponentFactory<AbstractFilter<unknown>>;
  filterConfig: FilterConfig<unknown>;
  variant: FILTER_VARIANT;
}

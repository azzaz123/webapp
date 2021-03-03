import { FILTER_TYPES } from '../../../core/enums/filter-types/filter-types.enum';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { RangeFilterComponent } from '../../range-filter/range-filter.component';
import { ToggleFilterComponent } from '../../toggle-filter/toggle-filter.component';

export const FILTER_TYPE_COMPONENT: Record<FILTER_TYPES, any> = {
  // TODO AbstractFilter<unknown> instead of any is not working, why
  [FILTER_TYPES.RANGE]: RangeFilterComponent,
  [FILTER_TYPES.TOGGLE]: ToggleFilterComponent,
};

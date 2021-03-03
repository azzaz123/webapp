import { FILTER_TYPES } from '../../../core/enums/filter-types/filter-types.enum';
import { RangeFilterComponent } from '../../range-filter/range-filter.component';
import { ToggleFilterComponent } from '../../toggle-filter/toggle-filter.component';

export const FILTER_TYPE_COMPONENT: Record<FILTER_TYPES, unknown> = {
  [FILTER_TYPES.RANGE]: RangeFilterComponent,
  [FILTER_TYPES.TOGGLE]: ToggleFilterComponent,
};

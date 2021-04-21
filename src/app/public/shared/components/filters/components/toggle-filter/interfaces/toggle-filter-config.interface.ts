import { FilterConfig } from '@public/shared/components/filters/interfaces/filter-config.interface';
import { ToggleFilterParams } from './toggle-filter-params.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

export interface ToggleFilterConfig extends FilterConfig<ToggleFilterParams> {
  type: FILTER_TYPES.TOGGLE;
}

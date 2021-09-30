import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { GridSelectFilterParams } from './grid-select-filter-params.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

export interface GridSelectFilterConfig extends FilterConfig<GridSelectFilterParams> {
  type: FILTER_TYPES.GRID;
  isMultiselect: boolean;
  hasBigIcons: boolean;
  mirrorsValueIcon?: boolean;
  hideLabels?: boolean;
  isBooleanFormat?: boolean;
  gridColumns: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

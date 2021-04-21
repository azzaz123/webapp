import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { GridSelectFilterParams } from './grid-select-filter-params.interface';

export interface GridSelectFilterConfig extends FilterConfig<GridSelectFilterParams> {
  isMultiselect: boolean;
  hasBigIcons: boolean;
  mirrorsValueIcon?: boolean;
  hideLabels?: boolean;
}

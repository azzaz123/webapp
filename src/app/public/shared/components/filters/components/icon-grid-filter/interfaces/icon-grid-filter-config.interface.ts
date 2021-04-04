import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { IconGridFilterParams } from './icon-grid-filter-params.interface';

export interface IconGridFilterConfig extends FilterConfig<IconGridFilterParams> {
  isMultiselect: boolean;
  hasBigIcons: boolean;
}

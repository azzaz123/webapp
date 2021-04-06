import { AbstractSelectFilterConfig } from '../../abstract-select-filter/interfaces/abstract-select-filter-config.interface';
import { SelectFilterParams } from './select-filter-params.interface';

export interface SelectFilterConfig extends AbstractSelectFilterConfig<SelectFilterParams> {
  hasContentPlaceholder: true;
}

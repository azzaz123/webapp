import { AbstractSelectFilterConfig } from '../../abstract-select-filter/interfaces/abstract-select-filter-config.interface';
import { SelectFilterParams } from './select-filter-params.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

export interface SelectFilterConfig extends AbstractSelectFilterConfig<SelectFilterParams> {
  type: FILTER_TYPES.SELECT;
  hasContentPlaceholder: true;
}

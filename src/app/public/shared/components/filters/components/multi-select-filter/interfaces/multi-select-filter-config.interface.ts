import { MultiSelectFilterParams } from './multi-select-filter-params.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { AbstractSelectFilterConfig } from '../../abstract-select-filter/interfaces/abstract-select-filter-config.interface';

export interface MultiSelectFilterConfig extends AbstractSelectFilterConfig<MultiSelectFilterParams> {
  type: FILTER_TYPES.MULTISELECT;
  hasContentPlaceholder: true;
}

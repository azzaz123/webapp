import { AbstractSelectFilterConfig } from '../../abstract-select-filter/interfaces/abstract-select-filter-config.interface';
import { SuggesterFilterParams } from './suggester-filter-params.interface';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

export interface SuggesterFilterConfig extends AbstractSelectFilterConfig<SuggesterFilterParams> {
  type: FILTER_TYPES.SUGGESTER;
  hasContentPlaceholder: true;
  hasOptionsOnInit: boolean;
  suggesterPlaceholder: string;
}

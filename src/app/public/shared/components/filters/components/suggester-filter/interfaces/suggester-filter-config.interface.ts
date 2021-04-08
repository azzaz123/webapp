import { AbstractSelectFilterConfig } from '../../abstract-select-filter/interfaces/abstract-select-filter-config.interface';
import { SuggesterFilterParams } from './suggester-filter-params.interface';

export interface SuggesterFilterConfig extends AbstractSelectFilterConfig<SuggesterFilterParams> {
  hasContentPlaceholder: true;
  hasOptionsOnInit: boolean;
  suggesterPlaceholder: string;
}

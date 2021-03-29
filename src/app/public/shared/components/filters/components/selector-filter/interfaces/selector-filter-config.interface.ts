import { AbstractSelectorFilterConfig } from '../../abstract-selector-filter/interfaces/selector-filter-config.interface';
import { SelectorFilterParams } from './selector-filter-params.interface';

export interface SelectorFilterConfig extends AbstractSelectorFilterConfig<SelectorFilterParams> {
  hasContentPlaceholder: true;
}

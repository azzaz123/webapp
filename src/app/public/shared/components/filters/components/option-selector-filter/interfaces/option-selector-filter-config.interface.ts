import { AbstractSelectorFilterConfig } from '../../abstract-selector-filter/interfaces/selector-filter-config.interface';
import { OptionSelectorFilterParams } from './option-selector-filter-params.interface';

export interface SelectorFilterConfig extends AbstractSelectorFilterConfig<OptionSelectorFilterParams> {
  hasContentPlaceholder: true;
}

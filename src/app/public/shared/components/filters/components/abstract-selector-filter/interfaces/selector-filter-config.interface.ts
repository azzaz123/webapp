import { FilterConfig } from '../../../interfaces/filter-config.interface';

export interface SelectorFilterConfig extends FilterConfig<Record<string, string>> {
  hasContentPlaceholder: boolean;
}

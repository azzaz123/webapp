import { FilterConfig } from '../../../interfaces/filter-config.interface';

export interface SelectorFilterConfig<T extends Record<string, string>> extends FilterConfig<T> {
  hasContentPlaceholder: boolean;
}

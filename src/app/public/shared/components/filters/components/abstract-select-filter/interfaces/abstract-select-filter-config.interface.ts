import { FilterConfig } from '../../../interfaces/filter-config.interface';

export interface AbstractSelectFilterConfig<T extends Record<keyof T, string>> extends FilterConfig<T> {
  hasContentPlaceholder: boolean;
}

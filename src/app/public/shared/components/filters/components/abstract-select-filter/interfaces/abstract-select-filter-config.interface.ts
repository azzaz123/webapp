import { FilterConfig } from '../../../interfaces/filter-config.interface';

export interface AbstractSelectFilterConfig<T extends Partial<Record<keyof T, string>>> extends FilterConfig<T> {
  hasContentPlaceholder: boolean;
}

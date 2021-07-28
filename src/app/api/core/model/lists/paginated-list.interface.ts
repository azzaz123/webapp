import { SORT_BY } from '@api/core/model';

export interface PaginatedList<T> {
  list: T[];
  paginationParameter?: string;
  orderParameter?: SORT_BY;
}

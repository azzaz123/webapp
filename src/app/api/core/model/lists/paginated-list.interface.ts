import { SORT_BY } from '@api/core/model';

export interface PaginatedList<T, P = string> {
  list: T[];
  paginationParameter?: P;
  orderParameter?: SORT_BY;
}

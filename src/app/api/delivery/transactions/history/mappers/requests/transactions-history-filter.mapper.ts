import { HttpParams } from '@angular/common/http';
import { ToApiMapper } from '@api/core/utils/types';

type TransactionsHistoryFilters = { page: number };

export const mapTransactionsHistoryFiltersToApi: ToApiMapper<TransactionsHistoryFilters, HttpParams> = (
  input: TransactionsHistoryFilters
): HttpParams => {
  return new HttpParams().appendAll({
    page: input.page.toString(),
  });
};

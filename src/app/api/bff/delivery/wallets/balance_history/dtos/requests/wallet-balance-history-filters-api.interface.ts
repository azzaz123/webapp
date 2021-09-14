import { HttpParams } from '@angular/common/http';
import { InnerType } from '@api/core/utils/types';

type AngularQueryParams = { [param: string]: string | string[] };

export interface WalletBalanceHistoryQueryParamsApi extends AngularQueryParams {
  page: string;
  type?: 'IN' | 'OUT';
}

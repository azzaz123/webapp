import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletBalanceHistoryQueryParamsApi } from '../dtos/requests/wallet-balance-history-filters-api.interface';
import { WalletBalanceHistoryApi } from '../dtos/responses';
import { WALLET_BALANCE_HISTORY_ENDPOINT } from './endpoints';

@Injectable()
export class WalletBalanceHistoryHttpService {
  constructor(private http: HttpClient) {}

  public get(params: WalletBalanceHistoryQueryParamsApi): Observable<any> {
    return this.http.get<WalletBalanceHistoryApi>(WALLET_BALANCE_HISTORY_ENDPOINT, { params });
  }
}

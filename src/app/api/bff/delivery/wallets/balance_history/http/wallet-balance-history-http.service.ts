import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletBalanceHistoryApi } from '../dtos/responses';
import { WALLET_BALANCE_HISTORY_ENDPOINT } from './endpoints';

@Injectable()
export class WalletBalanceHistoryHttpService {
  constructor(private http: HttpClient) {}

  public get(page: number = 0): Observable<WalletBalanceHistoryApi> {
    const params = { page: page.toString() };
    return this.http.get<WalletBalanceHistoryApi>(WALLET_BALANCE_HISTORY_ENDPOINT, { params });
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionsHistoryDto } from '../dtos/transactions-history-dto.interface';
import { DELIVERY_TRANSACTIONS_HISTORY_ENDPOINT } from './endpoints';

@Injectable()
export class TransactionsHistoryHttpService {
  constructor(private http: HttpClient) {}

  public get(params: HttpParams): Observable<TransactionsHistoryDto> {
    return this.http.get<TransactionsHistoryDto>(DELIVERY_TRANSACTIONS_HISTORY_ENDPOINT, { params });
  }
}

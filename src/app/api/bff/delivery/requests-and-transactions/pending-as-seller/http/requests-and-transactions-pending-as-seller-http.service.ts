import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestsAndTransactionsPendingAsSellerApi } from '../dtos/responses';
import { DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER } from './endpoints';

@Injectable()
export class RequestsAndTransactionsPendingAsSellerHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<RequestsAndTransactionsPendingAsSellerApi> {
    return this.http.get<RequestsAndTransactionsPendingAsSellerApi>(DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestsAndTransactionsPendingAsSellerDto, RequestsAndTransactionsPendingDto } from '../dtos/responses';
import {
  DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_ENDPOINT,
  DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_ENDPOINT,
} from './endpoints';

@Injectable()
export class RequestsAndTransactionsPendingHttpService {
  constructor(private http: HttpClient) {}

  public get(): Observable<RequestsAndTransactionsPendingDto> {
    return this.http.get<RequestsAndTransactionsPendingDto>(DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_ENDPOINT);
  }

  public getAsSeller(): Observable<RequestsAndTransactionsPendingAsSellerDto> {
    return this.http.get<RequestsAndTransactionsPendingAsSellerDto>(DELIVERY_REQUESTS_AND_TRANSACTIONS_PENDING_AS_SELLER_ENDPOINT);
  }
}

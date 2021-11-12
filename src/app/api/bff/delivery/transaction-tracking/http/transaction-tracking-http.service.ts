import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TRANSACTION_TRACKING_ENDPOINT } from '@api/bff/delivery/transaction-tracking/http/endpoints';
import { TransactionTrackingDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

import { Observable } from 'rxjs';

@Injectable()
export class TransactionTrackingHttpService {
  constructor(private httpClient: HttpClient) {}

  public get(requestId: string): Observable<TransactionTrackingDto> {
    return this.httpClient.get<TransactionTrackingDto>(TRANSACTION_TRACKING_ENDPOINT, { params: { requestId } });
  }
}

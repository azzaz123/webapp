import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TRANSACTION_TRACKING_ENDPOINT } from './endpoints';

@Injectable()
export class TransactionTrackingHttpService {
  constructor(private httpClient: HttpClient) {}

  public get(requestId: string): Observable<any> {
    return this.httpClient.get(TRANSACTION_TRACKING_ENDPOINT, { params: { requestId } });
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionTrackingHttpService } from './http/transaction-tracking-http.service';

@Injectable()
export class TransactionTrackingService {
  constructor(private transactionTrackingHttpService: TransactionTrackingHttpService) {}

  public get(requestId: string): Observable<unknown> {
    return this.transactionTrackingHttpService.get(requestId);
  }
}

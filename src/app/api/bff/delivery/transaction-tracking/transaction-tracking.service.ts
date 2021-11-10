import { Injectable } from '@angular/core';

import { mapTransactionTrackingDtoTransactionTracking } from '@api/bff/delivery/transaction-tracking/mappers/responses/transaction-tracking.mapper';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionTrackingService {
  constructor(private transactionTrackingHttpService: TransactionTrackingHttpService) {}

  public get(requestId: string): Observable<TransactionTracking> {
    return this.transactionTrackingHttpService.get(requestId).pipe(map(mapTransactionTrackingDtoTransactionTracking));
  }

  public getDetails(requestId: string): Observable<TransactionTrackingDetails> {
    return this.transactionTrackingHttpService.getDetails(requestId).pipe(map(mapTransactionTrackingDetails));
  }
}

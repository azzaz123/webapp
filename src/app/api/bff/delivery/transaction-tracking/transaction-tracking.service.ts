import { Injectable } from '@angular/core';
import { TransactionTracking } from '@api/core/model/delivery/transaction/tracking';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionTrackingHttpService } from './http/transaction-tracking-http.service';
import { mapTransactionTrackingDtoTransactionTracking } from './mappers/responses/transaction-tracking.mapper';

@Injectable()
export class TransactionTrackingService {
  constructor(private transactionTrackingHttpService: TransactionTrackingHttpService) {}

  public get(requestId: string): Observable<TransactionTracking> {
    return this.transactionTrackingHttpService.get(requestId).pipe(map(mapTransactionTrackingDtoTransactionTracking));
  }
}

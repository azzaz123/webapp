import { Injectable } from '@angular/core';
import { PendingTransaction } from '@api/core/model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RequestsAndTransactionsPendingHttpService } from './http/requests-and-transactions-pending-http.service';
import { mapRequestsAndTransactionsPendingToPendingBalance } from './mappers/responses/requests-and-transactions-pending.mapper';

@Injectable()
export class RequestsAndTransactionsPendingService {
  constructor(private requestsAndTransactionsPendingHttpService: RequestsAndTransactionsPendingHttpService) {}

  public get pendingTransactions$(): Observable<PendingTransaction[]> {
    return this.requestsAndTransactionsPendingHttpService.get().pipe(take(1), map(mapRequestsAndTransactionsPendingToPendingBalance));
  }
}

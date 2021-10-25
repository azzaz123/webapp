import { Injectable } from '@angular/core';
import { PendingTransaction } from '@api/core/model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RequestsAndTransactionsPendingAsSellerHttpService } from './http/requests-and-transactions-pending-as-seller-http.service';
import { mapRequestsAndTransactionsPendingAsSellerToPendingBalance } from './mappers/responses/requests-and-transactions-pending-as-seller.mapper';

@Injectable()
export class RequestsAndTransactionsPendingAsSellerService {
  constructor(private requestsAndTransactionsPendingAsSellerHttpService: RequestsAndTransactionsPendingAsSellerHttpService) {}

  public get pendingTransactions$(): Observable<PendingTransaction[]> {
    return this.requestsAndTransactionsPendingAsSellerHttpService
      .get()
      .pipe(take(1), map(mapRequestsAndTransactionsPendingAsSellerToPendingBalance));
  }
}

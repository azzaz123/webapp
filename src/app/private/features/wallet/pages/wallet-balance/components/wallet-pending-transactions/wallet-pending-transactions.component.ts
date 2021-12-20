import { Component } from '@angular/core';

import { PendingTransaction } from '@api/core/model';
import { PendingTransactionsAndRequests } from '@api/core/model/delivery';
import { RequestsAndTransactionsPendingService } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.service';
import { SharedErrorActionService } from '@shared/error-action';

import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'tsl-wallet-pending-transactions',
  templateUrl: './wallet-pending-transactions.component.html',
  styleUrls: ['./wallet-pending-transactions.component.scss'],
})
export class WalletPendingTransactionsComponent {
  public pendingTransactionsAsSeller: Observable<PendingTransaction[]>;

  constructor(
    private requestsAndTransactionsPendingService: RequestsAndTransactionsPendingService,
    private errorActionService: SharedErrorActionService
  ) {
    this.pendingTransactionsAsSeller = this.requestsAndTransactionsPendingService.pendingTransactionsAsSeller.pipe(
      map((response: PendingTransactionsAndRequests) => response.transactions),
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }
}

import { Component } from '@angular/core';
import { RequestsAndTransactionsPendingService } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.service';
import { PendingTransaction } from '@api/core/model';
import { WalletSharedErrorActionService } from '@private/features/wallet/shared/error-action';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'tsl-wallet-pending-transactions',
  templateUrl: './wallet-pending-transactions.component.html',
  styleUrls: ['./wallet-pending-transactions.component.scss'],
})
export class WalletPendingTransactionsComponent {
  public pendingTransactions$: Observable<PendingTransaction[]>;

  constructor(
    private requestsAndTransactionsPendingService: RequestsAndTransactionsPendingService,
    private errorActionService: WalletSharedErrorActionService
  ) {
    this.pendingTransactions$ = this.requestsAndTransactionsPendingService.pendingTransactions$.pipe(
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }
}

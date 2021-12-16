import { Component } from '@angular/core';
import { RequestsAndTransactionsPendingService } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.service';
import { PendingTransaction } from '@api/core/model';
import { SharedErrorActionService } from '@shared/error-action';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

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
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }
}

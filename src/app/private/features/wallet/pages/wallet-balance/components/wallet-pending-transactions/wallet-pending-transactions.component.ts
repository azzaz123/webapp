import { Component } from '@angular/core';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';
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
  public walletPendingTransactions$: Observable<PendingTransaction[]>;

  constructor(
    private requestsAndTransactionsPendingAsSellerService: RequestsAndTransactionsPendingAsSellerService,
    private errorActionService: WalletSharedErrorActionService
  ) {
    this.walletPendingTransactions$ = this.requestsAndTransactionsPendingAsSellerService.walletPendingTransactions$.pipe(
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }
}

import { Component } from '@angular/core';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';
import { PendingTransaction } from '@api/core/model';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'tsl-wallet-pending-transactions',
  templateUrl: './wallet-pending-transactions.component.html',
  styleUrls: ['./wallet-pending-transactions.component.scss'],
})
export class WalletPendingTransactionsComponent {
  public walletPendingTransactions$: Observable<PendingTransaction[]>;

  constructor(private requestsAndTransactionsPendingAsSellerService: RequestsAndTransactionsPendingAsSellerService) {
    this.walletPendingTransactions$ = this.requestsAndTransactionsPendingAsSellerService.walletPendingTransactions$;
  }
}

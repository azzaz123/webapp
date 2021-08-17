import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PendingTransaction } from '@api/core/model';

const DEFAULT_VISIBLE_PENDING_TRANSACTIONS = 2;

@Component({
  selector: 'tsl-wallet-pending-transactions-list',
  templateUrl: './wallet-pending-transactions-list.component.html',
  styleUrls: ['./wallet-pending-transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPendingTransactionsListComponent {
  @Input() pendingTransactions: PendingTransaction[];

  public isPendingTransactionVisible(index: number): boolean {
    return index < DEFAULT_VISIBLE_PENDING_TRANSACTIONS;
  }
}

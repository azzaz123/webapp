import { Component, Input, OnInit } from '@angular/core';
import { PendingTransaction } from '@api/core/model';

@Component({
  selector: 'tsl-wallet-pending-transaction',
  templateUrl: './wallet-pending-transaction.component.html',
  styleUrls: ['./wallet-pending-transaction.component.scss'],
})
export class WalletPendingTransactionComponent {
  @Input() walletPendingTransaction: PendingTransaction;
}

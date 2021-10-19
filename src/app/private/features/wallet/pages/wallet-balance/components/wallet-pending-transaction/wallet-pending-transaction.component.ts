import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PendingTransaction } from '@api/core/model';

@Component({
  selector: 'tsl-wallet-pending-transaction',
  templateUrl: './wallet-pending-transaction.component.html',
  styleUrls: ['./wallet-pending-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPendingTransactionComponent {
  @Input() walletPendingTransaction: PendingTransaction;

  public get imageStyle(): Object {
    return {
      'background-image': `url(${this.walletPendingTransaction.item.imageUrl})`,
    };
  }
}

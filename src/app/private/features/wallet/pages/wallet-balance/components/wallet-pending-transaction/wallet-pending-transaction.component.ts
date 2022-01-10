import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';

@Component({
  selector: 'tsl-wallet-pending-transaction',
  templateUrl: './wallet-pending-transaction.component.html',
  styleUrls: ['./wallet-pending-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletPendingTransactionComponent {
  @Input() walletPendingTransaction: DeliveryPendingTransaction;

  public get imageStyle(): Object {
    return {
      'background-image': `url(${this.walletPendingTransaction.item.imageUrl})`,
    };
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';

@Component({
  selector: 'tsl-wallet-history-movement',
  templateUrl: './wallet-history-movement.component.html',
  styleUrls: ['./wallet-history-movement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletHistoryMovementComponent {
  @Input() walletMovementHistoryDetail: WalletMovementHistoryDetail;

  private MONEY_MOVEMENT_SVG_URL_BY_TYPE: Record<WALLET_HISTORY_MOVEMENT_TYPE, string> = {
    [WALLET_HISTORY_MOVEMENT_TYPE.IN]: 'assets/icons/money-in.svg',
    [WALLET_HISTORY_MOVEMENT_TYPE.OUT]: 'assets/icons/money-out.svg',
  };

  public get movementTypeIconUrl(): string {
    return this.MONEY_MOVEMENT_SVG_URL_BY_TYPE[this.walletMovementHistoryDetail.type];
  }
}

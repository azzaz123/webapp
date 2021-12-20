import { Component } from '@angular/core';

import { PRIVATE_PATHS } from '@private/private-routing-constants';

@Component({
  selector: 'tsl-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss'],
})
export class WalletBalanceComponent {
  public retryUrl: string = `${PRIVATE_PATHS.WALLET}/refresh`;
}

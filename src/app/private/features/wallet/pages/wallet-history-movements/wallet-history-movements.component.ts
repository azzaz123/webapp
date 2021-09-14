import { Component, OnInit } from '@angular/core';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WalletMovementsHistory } from '@api/core/model/wallet/history/movements-history';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'tsl-wallet-history-movements',
  templateUrl: './wallet-history-movements.component.html',
  styleUrls: ['./wallet-history-movements.component.scss'],
})
export class WalletHistoryMovementsComponent implements OnInit {
  public historicMovements$: Observable<WalletMovementsHistory>;

  public tabBarElements: TabsBarElement<WALLET_HISTORY_FILTERS>[] = [
    { value: WALLET_HISTORY_FILTERS.ALL, label: $localize`:@@movements_history_all_users_all_movements_tap_bar_title:All` },
    { value: WALLET_HISTORY_FILTERS.IN, label: $localize`:@@movements_history_all_users_inflows_tap_bar_title:Inflows` },
    { value: WALLET_HISTORY_FILTERS.OUT, label: $localize`:@@movements_history_all_users_outflows_tap_bar_title:Outflows` },
  ];

  constructor(private walletBalanceHistoryService: WalletBalanceHistoryService) {}

  ngOnInit() {
    this.historicMovements$ = this.walletBalanceHistoryService.get(0);
  }

  public onChangeFilter(filter: WALLET_HISTORY_FILTERS) {
    this.historicMovements$ = this.walletBalanceHistoryService.get(0, filter);
  }
}

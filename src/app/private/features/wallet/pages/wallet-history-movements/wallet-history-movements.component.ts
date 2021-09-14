import { Component, OnInit } from '@angular/core';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import {} from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WalletMovementsHistory } from './interfaces/wallet-movements-history.interface';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui.service.spec/wallet-history-movements-ui.service';

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

  private currentPage: number = 0;
  private nextPage: number = this.currentPage + 1;
  private currentFilter: WALLET_HISTORY_FILTERS = WALLET_HISTORY_FILTERS.ALL;

  constructor(
    private walletBalanceHistoryService: WalletBalanceHistoryService,
    private walletHistoryMovementsUIService: WalletHistoryMovementsUIService
  ) {}

  ngOnInit() {
    this.getItems(true);
  }

  public onChangeFilter(filter: WALLET_HISTORY_FILTERS) {
    this.currentFilter = filter;
    this.currentPage = 0;
    this.getItems(true);
  }

  public getItems(initialLoad: boolean = false): void {
    const isNextPageNotDefined = !this.nextPage;
    const isNotInitialLoad = !initialLoad;
    const noMoreItemsNeeded = isNextPageNotDefined && isNotInitialLoad;
    if (noMoreItemsNeeded) {
      return;
    }

    this.historicMovements$ = this.walletBalanceHistoryService.get(this.currentPage, this.currentFilter).pipe(
      tap((list) => (this.nextPage = list.paginationParameter)),
      map((list) => this.walletHistoryMovementsUIService.map(list))
    );
  }
}

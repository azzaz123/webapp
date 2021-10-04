import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { finalize, tap } from 'rxjs/operators';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui/wallet-history-movements-ui.service';

@Component({
  selector: 'tsl-wallet-history-movements',
  templateUrl: './wallet-history-movements.component.html',
  styleUrls: ['./wallet-history-movements.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletHistoryMovementsComponent implements OnInit {
  public tabBarElements: TabsBarElement<WALLET_HISTORY_FILTERS>[] = [
    { value: WALLET_HISTORY_FILTERS.ALL, label: $localize`:@@movements_history_all_users_all_movements_tap_bar_title:All` },
    { value: WALLET_HISTORY_FILTERS.IN, label: $localize`:@@movements_history_all_users_inflows_tap_bar_title:Inflows` },
    { value: WALLET_HISTORY_FILTERS.OUT, label: $localize`:@@movements_history_all_users_outflows_tap_bar_title:Outflows` },
  ];

  public loading: boolean = true;
  public historicList: HistoricList;
  private initialLoad: boolean = true;
  private currentPage: number = 0;
  private nextPage: number = this.currentPage + 1;
  private currentFilter: WALLET_HISTORY_FILTERS = WALLET_HISTORY_FILTERS.ALL;
  private requestedHistoryMovementsDetails: WalletMovementHistoryDetail[] = [];

  constructor(
    private walletBalanceHistoryService: WalletBalanceHistoryService,
    private walletHistoryMovementsUIService: WalletHistoryMovementsUIService
  ) {}

  public get noMoreItemsNeededToLoad(): boolean {
    return !this.nextPage && !this.initialLoad;
  }

  public get infiniteScrollDisabled(): boolean {
    return this.noMoreItemsNeededToLoad || this.loading;
  }

  ngOnInit() {
    this.getItems();
  }

  public onChangeFilter(filter: WALLET_HISTORY_FILTERS) {
    this.currentFilter = filter;
    this.resetCountersAndValues();
    this.getItems();
  }

  public getItems(): void {
    this.loading = true;

    if (this.noMoreItemsNeededToLoad) {
      return;
    }

    this.currentPage = this.calculateCurrentPage();

    this.walletBalanceHistoryService
      .get(this.currentPage, this.currentFilter)
      .pipe(
        tap((response) => {
          const { list, paginationParameter, walletBalance } = response;
          this.nextPage = paginationParameter;
          this.requestedHistoryMovementsDetails = this.requestedHistoryMovementsDetails.concat(list);

          this.historicList = this.walletHistoryMovementsUIService.mapToHistoricList(this.requestedHistoryMovementsDetails);
        }),
        finalize(() => {
          this.loading = false;
          this.initialLoad = false;
        })
      )
      .subscribe();
  }

  public showBalance(): boolean {
    return this.currentFilter === WALLET_HISTORY_FILTERS.ALL;
  }

  private calculateCurrentPage(): number {
    if (this.initialLoad) {
      return 0;
    }
    return this.nextPage?.valueOf();
  }

  private resetCountersAndValues(): void {
    this.initialLoad = true;
    this.requestedHistoryMovementsDetails = [];
    this.nextPage = null;
  }
}

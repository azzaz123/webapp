import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { Money } from '@api/core/model/money.interface';
import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import {} from '@api/core/model/wallet/history/wallet-movements-history-list.interface';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { WalletMovementsHistory } from './interfaces/wallet-movements-history.interface';
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
  public loadingIconSrc = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;
  public totalBalance: Money;
  private initialLoad: boolean = true;
  private currentPage: number = 0;
  private nextPage: number = this.currentPage + 1;
  private currentFilter: WALLET_HISTORY_FILTERS = WALLET_HISTORY_FILTERS.ALL;
  private requestedHistoryMovementsDetails: WalletMovementHistoryDetail[] = [];
  private readonly _historicMovements$: ReplaySubject<WalletMovementsHistory> = new ReplaySubject<WalletMovementsHistory>(1);

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

  public get historicMovements$(): Observable<WalletMovementsHistory> {
    return this._historicMovements$.asObservable();
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
          this.totalBalance = walletBalance;
          this.requestedHistoryMovementsDetails = this.requestedHistoryMovementsDetails.concat(list);

          const mappedToUI = this.walletHistoryMovementsUIService.map(this.requestedHistoryMovementsDetails);
          this._historicMovements$.next(mappedToUI);
        }),
        finalize(() => {
          this.loading = false;
          this.initialLoad = false;
        })
      )
      .subscribe();
  }

  public isHistoricMovementsEmpty(historicMovements: WalletMovementsHistory): boolean {
    return historicMovements.years.length === 0;
  }

  public isBalanceVisible(isFirstYear: boolean, isFirstMonth: boolean): boolean {
    return isFirstYear && isFirstMonth && this.currentFilter === WALLET_HISTORY_FILTERS.ALL;
  }

  private calculateCurrentPage(): number {
    if (this.initialLoad) {
      return 0;
    }
    return this.nextPage?.valueOf();
  }

  private resetCountersAndValues(): void {
    this.initialLoad = true;
    this._historicMovements$.next(null);
    this.requestedHistoryMovementsDetails = [];
    this.nextPage = null;
  }
}
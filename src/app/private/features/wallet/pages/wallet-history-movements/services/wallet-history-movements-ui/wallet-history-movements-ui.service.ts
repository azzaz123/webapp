import { Injectable } from '@angular/core';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WalletMovementHistoryDetail } from '@api/core/model/wallet/history/movement-history-detail';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, finalize, take } from 'rxjs/operators';
import { mapWalletBalanceHistoryDetailsToHistoricList } from './mappers/wallet-balance-history-to-historic-element.mapper';

@Injectable()
export class WalletHistoryMovementsUIService {
  private initialLoad: boolean = true;
  private currentPage: number = 0;
  private nextPage: number = this.currentPage + 1;
  private requestedHistoryMovementsDetails: WalletMovementHistoryDetail[] = [];
  private _loading: boolean = false;
  private readonly _loading$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly _historicList$: ReplaySubject<HistoricList> = new ReplaySubject(1);

  constructor(private walletBalanceHistoryService: WalletBalanceHistoryService) {}

  public get infiniteScrollDisabled(): boolean {
    return !this.nextPage && !this.initialLoad;
  }

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  public get historicList$(): Observable<HistoricList> {
    return this._historicList$.asObservable();
  }

  private set historicList(value: HistoricList) {
    this._historicList$.next(value);
  }

  private get loading(): boolean {
    return this._loading;
  }

  private set loading(value: boolean) {
    this._loading = value;
    this._loading$.next(value);
  }

  public getItems(filter: WALLET_HISTORY_FILTERS): void {
    const canNotLoadMoreItems = this.infiniteScrollDisabled || this.loading;
    if (canNotLoadMoreItems) {
      return;
    }

    this.loading = true;
    this.currentPage = this.calculateCurrentPage();

    this.walletBalanceHistoryService
      .get(this.currentPage, filter)
      .pipe(
        tap((response) => {
          const { list, paginationParameter, walletBalance } = response;
          this.nextPage = paginationParameter;
          this.requestedHistoryMovementsDetails = this.requestedHistoryMovementsDetails.concat(list);
          this.historicList = mapWalletBalanceHistoryDetailsToHistoricList(this.requestedHistoryMovementsDetails, walletBalance);
        }),
        finalize(() => {
          this.initialLoad = false;
          this.loading = false;
        }),
        take(1)
      )
      .subscribe();
  }

  public reset(): void {
    this.historicList = null;
    this.initialLoad = true;
    this.requestedHistoryMovementsDetails = [];
    this.nextPage = null;
  }

  private calculateCurrentPage(): number {
    if (this.initialLoad) {
      return 0;
    }
    return this.nextPage?.valueOf();
  }
}

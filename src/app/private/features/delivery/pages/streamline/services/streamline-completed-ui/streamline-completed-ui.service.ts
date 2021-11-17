import { Injectable } from '@angular/core';
import { HistoricTransaction } from '@api/core/model';
import { TransactionsHistoryApiService } from '@api/delivery/transactions/history/transactions-history-api.service';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { ReplaySubject, Observable, Subscription } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { mapHistoricTransactionsToHistoricList } from '../../mappers/historic-transactions-to-historic-list/historic-transactions-to-historic-list.mapper';

@Injectable()
export class StreamlineCompletedUIService {
  private initialLoad: boolean = true;
  private currentPage: number = 0;
  private nextPage: number = this.currentPage + 1;
  private requestedHistoricTransactionsDate: HistoricTransaction[] = [];
  private _loading: boolean = false;
  private subscriptions: Subscription[] = [];
  private readonly _loading$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly _historicList$: ReplaySubject<HistoricList> = new ReplaySubject(1);

  constructor(private transactionsHistoryApiService: TransactionsHistoryApiService) {}

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

  public getItems(): void {
    const canNotLoadMoreItems = this.infiniteScrollDisabled || this.loading;
    if (canNotLoadMoreItems) {
      return;
    }

    this.loading = true;
    this.currentPage = this.calculateCurrentPage();

    const getRequest = this.transactionsHistoryApiService
      .get(this.currentPage)
      .pipe(
        take(1),
        tap((response) => {
          this.nextPage = this.calculateNextPage(response);
          this.requestedHistoricTransactionsDate = this.requestedHistoricTransactionsDate.concat(response);
          this.historicList = mapHistoricTransactionsToHistoricList(this.requestedHistoricTransactionsDate);
        }),
        finalize(() => {
          this.initialLoad = false;
          this.loading = false;
        })
      )
      .subscribe();

    this.subscriptions.push(getRequest);
  }

  public reset(): void {
    this.historicList = null;
    this.initialLoad = true;
    this.requestedHistoricTransactionsDate = [];
    this.nextPage = null;
    this.loading = false;
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private calculateCurrentPage(): number {
    if (this.initialLoad) {
      return 0;
    }
    return this.nextPage?.valueOf();
  }

  private calculateNextPage(response: HistoricTransaction[]): number | null {
    const isResponseEmpty: boolean = response.length === 0;
    return isResponseEmpty ? null : this.currentPage + 1;
  }
}

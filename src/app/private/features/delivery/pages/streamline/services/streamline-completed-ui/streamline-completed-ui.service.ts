import { Injectable } from '@angular/core';

import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { HistoricTransaction } from '@api/core/model';
import { mapHistoricTransactionsToHistoricList } from '@private/features/delivery/pages/streamline/mappers/historic-transactions-to-historic-list/historic-transactions-to-historic-list.mapper';
import { TransactionsHistoryApiService } from '@api/delivery/transactions/history/transactions-history-api.service';

import { catchError, finalize, take, tap } from 'rxjs/operators';
import { ReplaySubject, Observable, Subscription, throwError } from 'rxjs';

@Injectable()
export class StreamlineCompletedUIService {
  private initialLoad: boolean = true;
  private currentPage: number = 0;
  private nextPage: number = this.currentPage + 1;
  private requestedHistoricTransactionsDate: HistoricTransaction[] = [];
  private _loading: boolean = false;
  private subscriptions: Subscription[] = [];
  private readonly _loading$: ReplaySubject<boolean> = new ReplaySubject(1);
  private _historicList$: ReplaySubject<HistoricList> = new ReplaySubject(1);

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
        catchError((error: unknown) => {
          this._historicList$.error(error);
          this.resetSubject();
          return throwError(error);
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
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.historicList = null;
    this.initialLoad = true;
    this.requestedHistoricTransactionsDate = [];
    this.nextPage = null;
    this.loading = false;
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

  private resetSubject(): void {
    if (!!this._historicList$) {
      this._historicList$.complete();
    }
    this._historicList$ = new ReplaySubject<HistoricList>(1);
  }
}

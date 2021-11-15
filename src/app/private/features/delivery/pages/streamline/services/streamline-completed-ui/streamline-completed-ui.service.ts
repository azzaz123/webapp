import { Injectable } from '@angular/core';
import { TransactionWithCreationDate } from '@api/core/model';
import { TransactionsHistoryApiService } from '@api/delivery/transactions/history/transactions-history-api.service';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { ReplaySubject, Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { mapTransactionsWithCreationDateToHistoricList } from '../../mappers/transactions-with-creation-date-to-historic-list/transactions-with-creation-date-to-historic-list.mapper';

@Injectable()
export class StreamlineCompletedUIService {
  private initialLoad: boolean = true;
  private currentPage: number = 0;
  private nextPage: number = this.currentPage.valueOf() + 1;
  private requestedTransactionsWithCreationDate: TransactionWithCreationDate[] = [];
  private _loading: boolean = false;
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

    this.transactionsHistoryApiService
      .get(this.currentPage)
      .pipe(
        tap((response) => {
          this.nextPage = this.calculateNextPage(response);
          this.requestedTransactionsWithCreationDate = this.requestedTransactionsWithCreationDate.concat(response);
          this.historicList = mapTransactionsWithCreationDateToHistoricList(this.requestedTransactionsWithCreationDate);
        })
      )
      .subscribe({
        next: () => {
          this.initialLoad = false;
          this.loading = false;
        },
      });
  }

  public reset(): void {
    this.historicList = null;
    this.initialLoad = true;
    this.requestedTransactionsWithCreationDate = [];
    this.nextPage = null;
  }

  private calculateCurrentPage(): number {
    if (this.initialLoad) {
      return 0;
    }
    return this.nextPage?.valueOf();
  }

  private calculateNextPage(response: TransactionWithCreationDate[]): number | null {
    const isResponseEmpty: boolean = response.length === 0;
    return isResponseEmpty ? null : this.currentPage.valueOf() + 1;
  }
}

import { Injectable } from '@angular/core';
import { RequestsAndTransactionsPendingService } from '@api/bff/delivery/requests-and-transactions/pending/requests-and-transactions-pending.service';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { tap, take, finalize, catchError } from 'rxjs/operators';
import { mapPendingTransactionToHistoricList } from '../../mappers/pending-transactions-to-historic-list/pending-transactions-to-historic-list.mapper';

@Injectable()
export class StreamlineOngoingUIService {
  private _loading: boolean = false;
  private readonly _loading$: ReplaySubject<boolean> = new ReplaySubject(1);
  private _historicList$: ReplaySubject<HistoricList> = new ReplaySubject(1);

  constructor(private requestsAndTransactionsPendingService: RequestsAndTransactionsPendingService) {}

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
    const canNotLoadMoreItems = this.loading;
    if (canNotLoadMoreItems) {
      return;
    }

    this.loading = true;

    this.requestsAndTransactionsPendingService.pendingTransactionsAndRequests
      .pipe(
        tap((response) => {
          this.historicList = mapPendingTransactionToHistoricList(response);
        }),
        catchError((error: unknown) => {
          this._historicList$.error(error);
          this.resetSubject();
          return throwError(error);
        }),
        finalize(() => {
          this.loading = false;
        }),
        take(1)
      )
      .subscribe();
  }

  public reset(): void {
    this.historicList = null;
  }

  private resetSubject(): void {
    this._historicList$.complete();
    this._historicList$ = new ReplaySubject<HistoricList>(1);
  }
}

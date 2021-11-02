import { Injectable } from '@angular/core';
import { RequestsAndTransactionsPendingAsSellerService } from '@api/bff/delivery/requests-and-transactions/pending-as-seller/requests-and-transactions-pending-as-seller.service';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, take, finalize } from 'rxjs/operators';
import { mapPendingTransactionToHistoricList } from '../../mappers/pending-transactions-to-historic-list.mapper';

@Injectable()
export class StreamlineOngoingUIService {
  private _loading: boolean = false;
  private readonly _loading$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly _historicList$: ReplaySubject<HistoricList> = new ReplaySubject(1);

  constructor(private requestsAndTransactionsPendingAsSellerService: RequestsAndTransactionsPendingAsSellerService) {}

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

    this.requestsAndTransactionsPendingAsSellerService.pendingTransactions$
      .pipe(
        tap((response) => {
          this.historicList = mapPendingTransactionToHistoricList(response);
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
}

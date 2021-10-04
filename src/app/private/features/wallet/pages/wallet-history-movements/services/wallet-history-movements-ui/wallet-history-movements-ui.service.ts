import { Injectable } from '@angular/core';
import { WalletBalanceHistoryService } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.service';
import { WalletMovementHistoryDetail, WALLET_HISTORY_MOVEMENT_TYPE } from '@api/core/model/wallet/history/movement-history-detail';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import * as moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

const MONEY_MOVEMENT_SVG_URL_BY_TYPE: Record<WALLET_HISTORY_MOVEMENT_TYPE, string> = {
  [WALLET_HISTORY_MOVEMENT_TYPE.IN]: 'assets/icons/money-in.svg',
  [WALLET_HISTORY_MOVEMENT_TYPE.OUT]: 'assets/icons/money-out.svg',
};

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

  public get noMoreItemsAvailable(): boolean {
    return !this.nextPage && !this.initialLoad;
  }

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  public get historicList$(): Observable<HistoricList> {
    return this._historicList$.asObservable();
  }

  private get loading(): boolean {
    return this._loading;
  }

  private set loading(value: boolean) {
    this._loading = value;
    this._loading$.next(value);
  }

  public getItems(filter: WALLET_HISTORY_FILTERS): void {
    const canNotLoadMoreItems = this.noMoreItemsAvailable || this.loading;
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

          const historicList: HistoricList = this.mapToHistoricList(this.requestedHistoryMovementsDetails);
          this._historicList$.next(historicList);
        }),
        finalize(() => {
          this.initialLoad = false;
          this.loading = false;
        })
      )
      .subscribe();
  }

  public reset(): void {
    this._historicList$.next(null);
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

  private mapToHistoricList(input: WalletMovementHistoryDetail[]): HistoricList {
    const result: HistoricList = { elements: [] };

    input.forEach((balanceHistoryElement: WalletMovementHistoryDetail) => {
      const headerFromElement = this.getYearFromHistoryElement(balanceHistoryElement);
      const subtitleFromElement = this.getMonthFromHistoryElement(balanceHistoryElement);

      const headerNeedsToBeAdded = !result.elements?.find((y) => y.label === headerFromElement);
      if (headerNeedsToBeAdded) {
        result.elements.push({ label: headerFromElement, elements: [] });
      }

      const headerInResult = result.elements.find((y) => y.label === headerFromElement);
      const subtitleNeedsToBeAdded = !headerInResult.elements.find((m) => m.label === subtitleFromElement);
      if (subtitleNeedsToBeAdded) {
        headerInResult.elements.push({
          label: subtitleFromElement,
          elements: [this.mapWalletBalanceHistoryElementToHistoricElement(balanceHistoryElement)],
        });
        return;
      }

      const subtitleInResult = headerInResult.elements.find((m) => m.label === subtitleFromElement);
      subtitleInResult.elements.push(this.mapWalletBalanceHistoryElementToHistoricElement(balanceHistoryElement));
    });

    return result;
  }

  private getYearFromHistoryElement(input: WalletMovementHistoryDetail): string {
    return moment(input.date).format('YYYY');
  }

  private getMonthFromHistoryElement(input: WalletMovementHistoryDetail): string {
    return moment(input.date).format('MMMM');
  }

  private mapWalletBalanceHistoryElementToHistoricElement(input: WalletMovementHistoryDetail): HistoricElement {
    const { imageUrl: itemImageUrl, type, title, description, estimatedPayoutDescription: subDescription, date, moneyAmmount } = input;
    const iconUrl = MONEY_MOVEMENT_SVG_URL_BY_TYPE[type];

    return {
      itemImageUrl,
      iconUrl,
      title,
      description,
      subDescription,
      date,
      moneyAmmount,
    };
  }
}

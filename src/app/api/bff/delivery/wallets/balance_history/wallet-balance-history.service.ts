import { Injectable } from '@angular/core';
import { WalletMovementsHistory } from '@api/core/model/wallet/history/movements-history';
import { WALLET_HISTORY_FILTERS } from '@api/core/model/wallet/history/wallet-history-filters.enum';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { WalletBalanceHistoryHttpService } from './http/wallet-balance-history-http.service';
import { mapWalletHistoryFiltersToApi } from './mappers/requests/wallet-balance-history-filter.mapper';
import { mapWalletBalanceHistoryApiToWalletMovements } from './mappers/responses/wallet-balance-history.mapper';

@Injectable()
export class WalletBalanceHistoryService {
  constructor(private walletBalanceHistoryHttpService: WalletBalanceHistoryHttpService) {}

  public get(page: number = 0, type?: WALLET_HISTORY_FILTERS): Observable<WalletMovementsHistory> {
    return this.walletBalanceHistoryHttpService
      .get(mapWalletHistoryFiltersToApi({ page, type }))
      .pipe(take(1), map(mapWalletBalanceHistoryApiToWalletMovements));
  }
}

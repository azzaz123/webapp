import { Injectable } from '@angular/core';
import { WalletMovementsHistory } from '@api/core/model/wallet/history/movements-history';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { WalletBalanceHistoryHttpService } from './http/wallet-balance-history-http.service';
import { mapWalletBalanceHistoryApiToWalletMovements } from './mappers/responses/wallet-balance-history.mapper';

@Injectable()
export class WalletBalanceHistoryService {
  constructor(private walletBalanceHistoryHttpService: WalletBalanceHistoryHttpService) {}

  public get(page: number = 0): Observable<WalletMovementsHistory> {
    return this.walletBalanceHistoryHttpService.get(page).pipe(take(1), map(mapWalletBalanceHistoryApiToWalletMovements));
  }
}

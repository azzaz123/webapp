import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { WalletBalanceHistoryHttpService } from './http/wallet-balance-history-http.service';
import { mapWalletBalanceHistoryApiToWalletMovements } from './mappers/responses/wallet-balance-history.mapper';

@Injectable()
export class WalletBalanceHistoryService {
  constructor(private walletBalanceHistoryHttpService: WalletBalanceHistoryHttpService) {}

  public get(page: number = 0): Observable<any> {
    return this.walletBalanceHistoryHttpService.get(page).pipe(take(1), map(mapWalletBalanceHistoryApiToWalletMovements));
  }
}

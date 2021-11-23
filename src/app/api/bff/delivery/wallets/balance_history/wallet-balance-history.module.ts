import { NgModule } from '@angular/core';
import { WalletBalanceHistoryHttpService } from './http/wallet-balance-history-http.service';
import { WalletBalanceHistoryService } from './wallet-balance-history.service';

@NgModule({
  providers: [WalletBalanceHistoryHttpService, WalletBalanceHistoryService],
})
export class WalletBalanceHistoryModule {}

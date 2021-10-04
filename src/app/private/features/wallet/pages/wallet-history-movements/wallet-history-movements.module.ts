import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { WalletBalanceHistoryModule } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.module';
import { WalletHistoryMovementsUIService } from './services/wallet-history-movements-ui/wallet-history-movements-ui.service';
import { HistoricListModule } from '@shared/historic-list/historic-list.module';

@NgModule({
  imports: [CommonModule, WalletBalanceHistoryModule, WalletHistoryMovementsRoutingModule, TabsBarModule, HistoricListModule],
  declarations: [walletHistoryMovementsRoutedComponents],
  providers: [WalletHistoryMovementsUIService],
})
export class WalletHistoryMovementsModule {}

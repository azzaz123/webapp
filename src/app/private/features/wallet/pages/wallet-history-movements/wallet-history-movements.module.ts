import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { WalletBalanceHistoryModule } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.module';

@NgModule({
  declarations: [walletHistoryMovementsRoutedComponents],
  imports: [CommonModule, WalletBalanceHistoryModule, WalletHistoryMovementsRoutingModule, TabsBarModule],
})
export class WalletHistoryMovementsModule {}

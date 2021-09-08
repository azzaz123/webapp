import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { WalletBalanceHistoryModule } from '@api/bff/delivery/wallets/balance_history/wallet-balance-history.module';
import { WalletHistoryMovementComponent } from './components/wallet-history-movement/wallet-history-movement.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

const walletHistoryMovementsNonRoutedComponents = [WalletHistoryMovementComponent];

@NgModule({
  declarations: [walletHistoryMovementsRoutedComponents, walletHistoryMovementsNonRoutedComponents],
  imports: [CommonModule, WalletBalanceHistoryModule, WalletHistoryMovementsRoutingModule, SvgIconModule, TabsBarModule],
})
export class WalletHistoryMovementsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';

@NgModule({
  declarations: [walletHistoryMovementsRoutedComponents],
  imports: [CommonModule, WalletHistoryMovementsRoutingModule, TabsBarModule],
})
export class WalletHistoryMovementsModule {}

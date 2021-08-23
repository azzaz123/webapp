import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { walletHistoryMovementsRoutedComponents, WalletHistoryMovementsRoutingModule } from './wallet-history-movements.routing.module';

@NgModule({
  declarations: [walletHistoryMovementsRoutedComponents],
  imports: [CommonModule, WalletHistoryMovementsRoutingModule],
})
export class WalletHistoryMovementsModule {}

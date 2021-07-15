import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WalletBalanceInfoModule } from './modules/wallet-balance-info/wallet-balance-info.module';
import { walletBalanceRoutedComponents, WalletBalanceRoutingModule } from './wallet-balance.routing.module';

@NgModule({
  imports: [CommonModule, WalletBalanceInfoModule, WalletBalanceRoutingModule],
  declarations: [walletBalanceRoutedComponents],
})
export class WalletBalanceModule {}

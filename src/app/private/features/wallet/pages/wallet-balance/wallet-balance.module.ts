import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WalletBalanceRoutedComponents, WalletBalanceRoutingModule } from './wallet-balance.routing.module';

@NgModule({
  declarations: [WalletBalanceRoutedComponents],
  imports: [WalletBalanceRoutingModule, CommonModule],
})
export class WalletBalanceModule {}

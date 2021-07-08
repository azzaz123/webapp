import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentsWalletsModule } from '@api/payments/wallets/payments-wallets.module';
import { WalletBalanceRoutedComponents, WalletBalanceRoutingModule } from './wallet-balance.routing.module';

@NgModule({
  declarations: [WalletBalanceRoutedComponents],
  imports: [WalletBalanceRoutingModule, PaymentsWalletsModule, CommonModule],
})
export class WalletBalanceModule {}

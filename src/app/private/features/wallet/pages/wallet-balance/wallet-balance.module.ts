import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentsWalletsModule } from '@api/payments/wallets/payments-wallets.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletBalanceRoutedComponents, WalletBalanceRoutingModule } from './wallet-balance.routing.module';

@NgModule({
  declarations: [WalletBalanceRoutedComponents],
  imports: [WalletBalanceRoutingModule, PaymentsWalletsModule, CommonModule, ButtonModule, SvgIconModule],
})
export class WalletBalanceModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PaymentsWalletsModule } from '@api/payments/wallets/payments-wallets.module';
import { WalletTransferModule } from '@private/features/wallet/modals/transfer/wallet-transfer.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletBalanceInfoComponent } from './wallet-balance-info.component';

@NgModule({
  imports: [PaymentsWalletsModule, CommonModule, ButtonModule, SvgIconModule, WalletTransferModule],
  declarations: [WalletBalanceInfoComponent],
  exports: [WalletBalanceInfoComponent],
})
export class WalletBalanceInfoModule {}

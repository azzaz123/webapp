import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferJumpDirective } from '@private/features/wallet/modals/transfer/directives/jump/wallet-transfer-jump.directive';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferMaxLengthDirective } from '@private/features/wallet/modals/transfer/directives/max-length/wallet-transfer-max-length.directive';

@NgModule({
  declarations: [WalletTransferAmountComponent, WalletTransferJumpDirective, WalletTransferMainComponent, WalletTransferMaxLengthDirective],
  imports: [ButtonModule, CommonModule, FormsModule, NumbersOnlyDirectiveModule, SvgIconModule],
})
export class WalletTransferModule {}

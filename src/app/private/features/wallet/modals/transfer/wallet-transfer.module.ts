import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { StepperModule } from '@shared/stepper/stepper.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferConfirmComponent } from '@private/features/wallet/modals/transfer/components/confirm/wallet-transfer-confirm.component';
import { WalletTransferJumpDirective } from '@private/features/wallet/modals/transfer/directives/jump/wallet-transfer-jump.directive';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferMaxLengthDirective } from '@private/features/wallet/modals/transfer/directives/max-length/wallet-transfer-max-length.directive';

@NgModule({
  declarations: [
    WalletTransferAmountComponent,
    WalletTransferConfirmComponent,
    WalletTransferJumpDirective,
    WalletTransferMainComponent,
    WalletTransferMaxLengthDirective,
  ],
  imports: [ButtonModule, CommonModule, FormsModule, NumbersOnlyDirectiveModule, StepperModule, SvgIconModule],
})
export class WalletTransferModule {}

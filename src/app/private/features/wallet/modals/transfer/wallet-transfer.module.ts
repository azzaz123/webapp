import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { NumbersOnlyDirectiveModule } from '@shared/directives/numbers-only/numbers-only.directive.module';
import { StepperModule } from '@shared/stepper/stepper.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletTransferAmountComponent } from '@private/features/wallet/modals/transfer/components/amount/wallet-transfer-amount.component';
import { WalletTransferApiService } from '@private/features/wallet/services/api/transfer-api/wallet-transfer-api.service';
import { WalletTransferConfirmComponent } from '@private/features/wallet/modals/transfer/components/confirm/wallet-transfer-confirm.component';
import { WalletTransferJumpDirective } from '@private/features/wallet/modals/transfer/directives/jump/wallet-transfer-jump.directive';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferMapperService } from '@private/features/wallet/services/transfer/mapper/wallet-transfer-mapper.service';
import { WalletTransferMaxLengthDirective } from '@private/features/wallet/modals/transfer/directives/max-length/wallet-transfer-max-length.directive';
import { WalletTransferService } from '@private/features/wallet/services/transfer/wallet-transfer.service';

@NgModule({
  declarations: [
    WalletTransferAmountComponent,
    WalletTransferConfirmComponent,
    WalletTransferJumpDirective,
    WalletTransferMainComponent,
    WalletTransferMaxLengthDirective,
  ],
  imports: [ButtonModule, CommonModule, FormsModule, NumbersOnlyDirectiveModule, StepperModule, SvgIconModule],
  providers: [WalletTransferApiService, WalletTransferMapperService, WalletTransferService],
})
export class WalletTransferModule {}

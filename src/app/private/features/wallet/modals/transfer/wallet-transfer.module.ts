import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';

@NgModule({
  declarations: [WalletTransferModalComponent],
  imports: [ButtonModule, CommonModule, SvgIconModule],
})
export class WalletTransferModule {}

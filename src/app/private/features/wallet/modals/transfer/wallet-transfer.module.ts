import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletTransferMainComponent } from '@private/features/wallet/modals/transfer/components/main/wallet-transfer-main.component';
import { WalletTransferModalComponent } from '@private/features/wallet/modals/transfer/components/modal/wallet-transfer-modal.component';

@NgModule({
  declarations: [WalletTransferMainComponent, WalletTransferModalComponent],
  imports: [CommonModule, SvgIconModule],
})
export class WalletTransferModule {}

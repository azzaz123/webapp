import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WalletSharedErrorActionComponent } from './components/error-action/wallet-shared-error-action.component';

@NgModule({
  declarations: [WalletSharedErrorActionComponent],
  imports: [CommonModule],
  exports: [WalletSharedErrorActionComponent],
})
export class WalletSharedErrorActionModule {}

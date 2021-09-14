import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { WalletSharedErrorActionComponent } from './components/error-action/wallet-shared-error-action.component';

@NgModule({
  declarations: [WalletSharedErrorActionComponent],
  imports: [BannerModule, ButtonModule, CommonModule, SvgIconModule],
  exports: [WalletSharedErrorActionComponent],
})
export class WalletSharedErrorActionModule {}

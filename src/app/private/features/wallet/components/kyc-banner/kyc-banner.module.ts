import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { KycBannerComponent } from './kyc-banner.component';

@NgModule({
  declarations: [KycBannerComponent],
  imports: [CommonModule, BannerModule, SvgIconModule, ButtonModule],
  exports: [KycBannerComponent],
})
export class KycBannerModule {}

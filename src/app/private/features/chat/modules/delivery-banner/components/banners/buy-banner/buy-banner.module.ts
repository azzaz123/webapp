import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { BuyBannerComponent } from './buy-banner.component';

@NgModule({
  declarations: [BuyBannerComponent],
  imports: [CommonModule, BannerModule, ButtonModule, LottieModule],
  exports: [BuyBannerComponent],
})
export class BuyBannerModule {}

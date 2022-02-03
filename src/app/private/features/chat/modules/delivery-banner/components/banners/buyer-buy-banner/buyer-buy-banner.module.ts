import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { BuyerBuyBannerComponent } from './buyer-buy-banner.component';

@NgModule({
  declarations: [BuyerBuyBannerComponent],
  imports: [CommonModule, BannerModule, ButtonModule, LottieModule],
  exports: [BuyerBuyBannerComponent],
})
export class BuyerBuyBannerModule {}

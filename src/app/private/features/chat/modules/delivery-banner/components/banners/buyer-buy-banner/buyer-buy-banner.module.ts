import { NgModule } from '@angular/core';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { BuyerBuyBannerComponent } from './buyer-buy-banner.component';

@NgModule({
  declarations: [BuyerBuyBannerComponent],
  imports: [ButtonModule, LottieModule],
  exports: [BuyerBuyBannerComponent],
})
export class BuyerBuyBannerModule {}

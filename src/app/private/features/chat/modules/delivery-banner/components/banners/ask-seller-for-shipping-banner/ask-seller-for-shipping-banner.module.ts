import { NgModule } from '@angular/core';
import { BannerModule } from '@shared/banner/banner.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { AskSellerForShippingBannerComponent } from './ask-seller-for-shipping-banner.component';

@NgModule({
  imports: [BannerModule, SvgIconModule],
  declarations: [AskSellerForShippingBannerComponent],
  exports: [AskSellerForShippingBannerComponent],
})
export class AskSellerForShippingBannerModule {}

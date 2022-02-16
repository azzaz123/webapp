import { NgModule } from '@angular/core';
import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ActivateShippingBannerComponent } from './activate-shipping-banner.component';

@NgModule({
  imports: [BannerModule, ButtonModule, SvgIconModule],
  declarations: [ActivateShippingBannerComponent],
  exports: [ActivateShippingBannerComponent],
})
export class ActivateShippingBannerModule {}

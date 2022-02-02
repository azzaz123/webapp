import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryBannerComponent } from './components/delivery-banner.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ButtonModule } from '@shared/button/button.module';
import { BannerModule } from '@shared/banner/banner.module';

@NgModule({
  imports: [CommonModule, SvgIconModule, ButtonModule, BannerModule],
  exports: [DeliveryBannerComponent],
  declarations: [DeliveryBannerComponent],
})
export class DeliveryBannerModule {}

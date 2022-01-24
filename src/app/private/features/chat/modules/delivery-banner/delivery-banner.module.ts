import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryBannerComponent } from './components/delivery-banner.component';
import { BannerModule } from '@shared/banner/banner.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ButtonModule } from '@shared/button/button.module';
import { DeliveryBannerService } from './services/delivery-banner/delivery-banner.service';

@NgModule({
  imports: [CommonModule, BannerModule, SvgIconModule, ButtonModule],
  exports: [DeliveryBannerComponent],
  providers: [DeliveryBannerService],
  declarations: [DeliveryBannerComponent],
})
export class DeliveryBannerModule {}

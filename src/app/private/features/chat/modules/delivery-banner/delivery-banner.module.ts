import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryBannerComponent } from './components/delivery-banner.component';
import { BannerModule } from '@shared/banner/banner.module';
import { BuyBannerModule, EditPriceBannerModule } from './components/banners';

const chatBannerModules = [BuyBannerModule, EditPriceBannerModule];

@NgModule({
  imports: [CommonModule, BannerModule, ...chatBannerModules],
  exports: [DeliveryBannerComponent],
  declarations: [DeliveryBannerComponent],
})
export class DeliveryBannerModule {}

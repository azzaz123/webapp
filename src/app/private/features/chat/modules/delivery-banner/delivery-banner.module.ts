import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryBannerComponent } from './components/delivery-banner.component';
import { BannerModule } from '@shared/banner/banner.module';
import { BuyBannerModule, EditPriceBannerModule } from './components/banners';
import { AskSellerForShippingBannerModule } from './components/banners/ask-seller-for-shipping-banner/ask-seller-for-shipping-banner.module';

const chatBannerModules = [BuyBannerModule, EditPriceBannerModule, AskSellerForShippingBannerModule];

@NgModule({
  imports: [CommonModule, BannerModule, ...chatBannerModules],
  exports: [DeliveryBannerComponent],
  declarations: [DeliveryBannerComponent],
})
export class DeliveryBannerModule {}

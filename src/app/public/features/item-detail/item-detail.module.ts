import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailService } from './core/services/item-detail.service';
import {
  itemDetailRoutedComponents,
  ItemDetailRoutingModule,
} from './item-detail-routing.module';
import { AdsModule } from '@public/shared/components/ads/ads.module';
import { ImagesCarouselModule } from '@public/shared/components/images-carousel/images-carousel.module';

@NgModule({
  declarations: [itemDetailRoutedComponents],
  imports: [
    CommonModule,
    ItemDetailRoutingModule,
    AdsModule,
    ImagesCarouselModule,
  ],
  providers: [ItemDetailService],
})
export class ItemDetailModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailService } from './core/services/item-detail.service';
import {
  itemDetailRoutedComponents,
  ItemDetailRoutingModule,
} from './item-detail-routing.module';
import { AdsModule } from '@public/shared/components/ads/ads.module';
import { ItemImagesModule } from '@public/shared/components/item-images/item-images.module';

@NgModule({
  declarations: [itemDetailRoutedComponents],
  imports: [CommonModule, ItemDetailRoutingModule, AdsModule, ItemImagesModule],
  providers: [ItemDetailService],
})
export class ItemDetailModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailService } from './core/services/item-detail.service';
import {
  itemDetailRoutedComponents,
  ItemDetailRoutingModule,
} from './item-detail-routing.module';
import { AdsModule } from '@public/shared/components/ads/ads.module';

@NgModule({
  declarations: [itemDetailRoutedComponents],
  imports: [CommonModule, ItemDetailRoutingModule, AdsModule],
  providers: [ItemDetailService],
})
export class ItemDetailModule {}

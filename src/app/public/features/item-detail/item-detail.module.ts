import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailService } from './core/services/item-detail.service';
import {
  itemDetailRoutedComponents,
  ItemDetailRoutingModule,
} from './item-detail-routing.module';
import { SkiesModule } from '@public/shared/components/skies/skies.module';

@NgModule({
  declarations: [itemDetailRoutedComponents],
  imports: [CommonModule, ItemDetailRoutingModule, SkiesModule],
  providers: [ItemDetailService],
})
export class ItemDetailModule {}

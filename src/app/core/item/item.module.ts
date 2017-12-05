import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';
import { MdIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { TrackingModule, UtilsModule } from 'shield';
import { ItemSoldComponent } from './item-sold/item-sold.component';
import { ItemReservedComponent } from './item-reserved/item-reserved.component';
import { ItemCartFavoriteComponent } from './item-cart-favorite/item-cart-favorite.component';
import { CustomTrackingModule } from '../tracking/custom-tracking.module';

@NgModule({
  imports: [
    TrackingModule,
    SharedModule,
    MdIconModule,
    CommonModule,
    UtilsModule,
    CustomTrackingModule
  ],
  exports: [
    ItemAvatarComponent,
    ItemSoldComponent,
    ItemReservedComponent,
    ItemCartFavoriteComponent
  ],
  declarations: [ItemAvatarComponent, ItemSoldComponent, ItemReservedComponent, ItemCartFavoriteComponent]
})
export class ItemModule { }

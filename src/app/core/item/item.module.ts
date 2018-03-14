import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { ItemSoldComponent } from './item-sold/item-sold.component';
import { ItemReservedComponent } from './item-reserved/item-reserved.component';
import { ItemCartFavoriteComponent } from './item-cart-favorite/item-cart-favorite.component';
import { TrackingModule } from '../tracking/tracking.module';
import { ItemService } from './item.service';
import { UtilsModule } from '../../utils/utils.module';

@NgModule({
  imports: [
    TrackingModule,
    SharedModule,
    MatIconModule,
    CommonModule,
    UtilsModule,
    TrackingModule
  ],
  exports: [
    ItemAvatarComponent,
    ItemSoldComponent,
    ItemReservedComponent,
    ItemCartFavoriteComponent
  ],
  providers: [
    ItemService
  ],
  declarations: [ItemAvatarComponent, ItemSoldComponent, ItemReservedComponent, ItemCartFavoriteComponent]
})
export class ItemModule { }

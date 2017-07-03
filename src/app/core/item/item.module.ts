import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';
import { MdIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { TrackingModule } from 'shield';
import { ItemSoldComponent } from './item-sold/item-sold.component';

@NgModule({
  imports: [
    TrackingModule,
    SharedModule,
    MdIconModule,
    CommonModule,
  ],
  exports: [
    ItemAvatarComponent,
    ItemSoldComponent
  ],
  declarations: [ItemAvatarComponent, ItemSoldComponent]
})
export class ItemModule { }

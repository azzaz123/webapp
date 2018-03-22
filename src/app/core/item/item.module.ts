import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { TrackingModule } from '../tracking/tracking.module';
import { ItemService } from './item.service';

@NgModule({
  imports: [
    TrackingModule,
    SharedModule,
    MatIconModule,
    CommonModule,
    TrackingModule
  ],
  exports: [
    ItemAvatarComponent
  ],
  providers: [
    ItemService
  ],
  declarations: [ItemAvatarComponent]
})
export class ItemModule { }

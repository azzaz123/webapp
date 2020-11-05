import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TrackingModule } from '../tracking/tracking.module';
import { ItemService } from './item.service';

@NgModule({
  imports: [TrackingModule, SharedModule, CommonModule, TrackingModule],
  providers: [ItemService],
})
export class ItemModule {}

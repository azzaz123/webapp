import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  providers: [
    ItemService
  ]
})
export class ItemModule { }

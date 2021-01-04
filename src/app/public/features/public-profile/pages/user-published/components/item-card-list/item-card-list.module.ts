import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardListComponent } from './item-card-list.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';

@NgModule({
  declarations: [ItemCardListComponent],
  imports: [CommonModule, ItemCardModule],
  exports: [ItemCardListComponent],
  providers: [DeviceDetectorService],
})
export class ItemCardListModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableMovableMapModule } from '../searchable-movable-map/searchable-movable-map.module';
import { DeliveryMapComponent } from './delivery-map.component';

@NgModule({
  declarations: [DeliveryMapComponent],
  imports: [SearchableMovableMapModule, CommonModule],
  exports: [DeliveryMapComponent],
})
export class DeliveryMapModule {}

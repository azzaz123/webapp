import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchableMovableMapModule } from '../searchable-movable-map/searchable-movable-map.module';
import { DeliveryMapComponent } from './delivery-map.component';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [DeliveryMapComponent],
  imports: [SearchableMovableMapModule, CommonModule, ButtonModule],
  exports: [DeliveryMapComponent],
})
export class DeliveryMapModule {}

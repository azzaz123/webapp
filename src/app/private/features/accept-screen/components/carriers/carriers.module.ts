import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarriersComponent } from './carriers.component';
import { CarrierComponent } from './carrier/carrier.component';

@NgModule({
  declarations: [CarriersComponent, CarrierComponent],
  imports: [CommonModule],
  exports: [CarriersComponent, CarrierComponent],
})
export class CarriersModule {}

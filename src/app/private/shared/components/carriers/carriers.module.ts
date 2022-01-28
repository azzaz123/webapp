import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarriersComponent } from './carriers.component';
import { CarrierComponent } from './carrier/carrier.component';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [CarriersComponent, CarrierComponent],
  imports: [CommonModule, ButtonModule],
  exports: [CarriersComponent, CarrierComponent],
})
export class CarriersModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryMethodSelectorComponent } from './delivery-method-selector.component';
import { CarrierComponent } from './carrier/carrier.component';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [DeliveryMethodSelectorComponent, CarrierComponent],
  imports: [CommonModule, ButtonModule],
  exports: [DeliveryMethodSelectorComponent, CarrierComponent],
})
export class DeliveryMethodSelectorModule {}

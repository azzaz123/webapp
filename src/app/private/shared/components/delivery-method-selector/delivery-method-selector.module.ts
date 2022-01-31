import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryMethodSelectorComponent } from './delivery-method-selector.component';
import { ButtonModule } from '@shared/button/button.module';
import { DeliveryMethodComponent } from './delivery-method/delivery-method.component';

@NgModule({
  declarations: [DeliveryMethodSelectorComponent, DeliveryMethodComponent],
  imports: [CommonModule, ButtonModule],
  exports: [DeliveryMethodSelectorComponent, DeliveryMethodComponent],
})
export class DeliveryMethodSelectorModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryRadioSelectorComponent } from './delivery-radio-selector.component';
import { DeliveryRadioOptionDirective } from './delivery-radio-option.directive';

@NgModule({
  declarations: [DeliveryRadioSelectorComponent, DeliveryRadioOptionDirective],
  imports: [CommonModule],
  exports: [DeliveryRadioSelectorComponent, DeliveryRadioOptionDirective],
})
export class DeliveryRadioSelectorModule {}

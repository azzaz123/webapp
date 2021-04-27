import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deliveryRoutedComponents, DeliveryRoutingModule } from './delivery.routing.module';
import { DeliveryDevelopmentDirective } from './directives/delivery-development.directive';

@NgModule({
  declarations: [deliveryRoutedComponents, DeliveryDevelopmentDirective],
  imports: [CommonModule, DeliveryRoutingModule],
  exports: [DeliveryDevelopmentDirective],
})
export class DeliveryModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deliveryRoutedComponents, deliveryRoutedModules, DeliveryRoutingModule } from './delivery.routing.module';

@NgModule({
  declarations: [deliveryRoutedComponents],
  imports: [CommonModule, DeliveryRoutingModule, deliveryRoutedModules],
})
export class DeliveryModule {}

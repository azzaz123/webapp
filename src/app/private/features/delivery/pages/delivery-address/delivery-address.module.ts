import { NgModule } from '@angular/core';
import { deliveryAddressRoutedComponents, DeliveryAddressRoutingModule } from './delivery-address.routing.module';

@NgModule({
  imports: [DeliveryAddressRoutingModule],
  declarations: [deliveryAddressRoutedComponents],
})
export class DeliveryAddressModule {}

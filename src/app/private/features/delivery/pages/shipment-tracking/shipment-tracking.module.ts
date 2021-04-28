import { NgModule } from '@angular/core';
import { shipmentTrackingRoutedComponents, ShipmentTrackingRoutingModule } from './shipment-tracking.routing.module';

@NgModule({
  imports: [ShipmentTrackingRoutingModule],
  declarations: [shipmentTrackingRoutedComponents],
})
export class ShipmentTrackingModule {}

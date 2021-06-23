import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ShipmentTrakingComponent } from './shipment-traking.component';

const routes: Route[] = [
  {
    path: '',
    component: ShipmentTrakingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipmentTrackingRoutingModule {}

export const shipmentTrackingRoutedComponents = [ShipmentTrakingComponent];

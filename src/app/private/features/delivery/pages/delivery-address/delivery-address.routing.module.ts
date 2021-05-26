import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DeliveryAddressComponent } from './delivery-address.component';

const routes: Route[] = [
  {
    path: '',
    component: DeliveryAddressComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryAddressRoutingModule {}

export const deliveryAddressRoutedComponents = [DeliveryAddressComponent];

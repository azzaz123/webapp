import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { DeliveryAddressModule } from './pages/delivery-address/delivery-address.module';
import { DeliveryComponent } from './pages/delivery.component';

// NOTE: they childs are begin loaded in a NON LAZY way but with the module
const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: DELIVERY_PATHS.DELIVERY_ADDRESS,
        loadChildren: () => DeliveryAddressModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRoutingModule {}

export const deliveryRoutedComponents = [DeliveryComponent];

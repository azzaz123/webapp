import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { DeliveryAddressComponent } from './delivery-address.component';
import { DeliveryAddressResolver } from './resolvers/delivery-address.resolver';

const routes: Route[] = [
  {
    path: '',
    component: DeliveryAddressComponent,
    canDeactivate: [ExitConfirmGuard],
    resolve: {
      hero: DeliveryAddressResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryAddressRoutingModule {}

export const deliveryAddressRoutedComponents = [DeliveryAddressComponent];

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { DeliveryComponent } from './pages/delivery.component';
import { DeliveryAcceptModule } from './pages/delivery-accept/delivery-accept.module';

const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: DELIVERY_PATHS.ACCEPT_SCREEN,
        loadChildren: () => DeliveryAcceptModule,
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

export const deliveryRoutedModules = [DeliveryAcceptModule];

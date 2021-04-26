import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { AcceptScreenModule } from './pages/accept-screen/accept-screen.module';
import { DeliveryComponent } from './pages/delivery.component';
import { PayviewModule } from './pages/payview/payview.module';

const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: DELIVERY_PATHS.ACCEPT_SCREEN,
        loadChildren: () => AcceptScreenModule,
      },
      {
        path: DELIVERY_PATHS.PAYVIEW,
        loadChildren: () => PayviewModule,
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

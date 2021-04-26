import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { AcceptScreenModule } from './pages/accept-screen/accept-screen.module';
import { DeliveryAddressModule } from './pages/delivery-address/delivery-address.module';
import { DeliveryComponent } from './pages/delivery.component';
import { TransactionTrackingScreenModule } from './pages/transaction-tracking-screen/transaction-tracking-screen';
import { PayviewModule } from './pages/payview/payview.module';

// NOTE: they childs are begin loaded in a NON LAZY way but with the module
const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: DELIVERY_PATHS.TIMELINE,
        loadChildren: () => TransactionTrackingScreenModule,
      },
      {
        path: DELIVERY_PATHS.ACCEPT_SCREEN,
        loadChildren: () => AcceptScreenModule,
      },
      {
        path: DELIVERY_PATHS.ADDRESS,
        loadChildren: () => DeliveryAddressModule,
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

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS, DELIVERY_PATH_PARAMS } from './delivery-routing-constants';
import { DeliveryComponent } from './pages/delivery.component';
import { AcceptScreenModule } from './pages/accept-screen/accept-screen.module';
import { DeliveryAddressModule } from './pages/delivery-address/delivery-address.module';
import { TransactionTrackingScreenModule } from './pages/transaction-tracking-screen/transaction-tracking-screen.module';
import { PayviewModule } from './pages/payview/payview.module';
import { StreamlineModule } from './pages/streamline/streamline.module';
import { CreateDisputeModule } from './pages/create-dispute/create-dispute.module';

// NOTE: they childs are begin loaded in a NON LAZY way but with the module
const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: `${DELIVERY_PATHS.TRACKING}`,
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
      {
        path: DELIVERY_PATHS.STREAMLINE,
        loadChildren: () => StreamlineModule,
      },
      {
        path: DELIVERY_PATHS.DISPUTE,
        loadChildren: () => CreateDisputeModule,
      },
      {
        path: '**',
        redirectTo: DELIVERY_PATHS.STREAMLINE,
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

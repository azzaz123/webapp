import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { DeliveryComponent } from './pages/delivery.component';
import { DeliveryAddressModule } from './pages/delivery-address/delivery-address.module';
import { TransactionTrackingScreenModule } from './pages/transaction-tracking-screen/transaction-tracking-screen.module';
import { PayviewModule } from './pages/payview/payview.module';
import { StreamlineModule } from './pages/streamline/streamline.module';
import { CreateDisputeModule } from './pages/create-dispute/create-dispute.module';
import { DeliveryDevelopmentGuard } from './guards/delivery-development.guard';
import { StreamlineCompletedModule } from './pages/streamline/pages/streamline-completed-overview/streamline-completed.module';

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
        path: DELIVERY_PATHS.ADDRESS,
        loadChildren: () => DeliveryAddressModule,
      },
      {
        path: DELIVERY_PATHS.PAYVIEW,
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => PayviewModule,
      },
      {
        path: DELIVERY_PATHS.BUYS,
        loadChildren: () => StreamlineModule,
      },
      {
        path: DELIVERY_PATHS.SELLS,
        loadChildren: () => StreamlineModule,
      },
      {
        path: DELIVERY_PATHS.COMPLETED,
        loadChildren: () => StreamlineCompletedModule,
      },
      {
        path: DELIVERY_PATHS.DISPUTE,
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => CreateDisputeModule,
      },
      {
        path: '**',
        redirectTo: DELIVERY_PATHS.BUYS,
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

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
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => TransactionTrackingScreenModule,
      },
      {
        path: DELIVERY_PATHS.ACCEPT_SCREEN,
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () =>
          import('@private/features/delivery/modals/accept-screen/accept-screen.module').then((m) => m.AcceptScreenModule),
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
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => StreamlineModule,
      },
      {
        path: DELIVERY_PATHS.SELLS,
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => StreamlineModule,
      },
      {
        path: DELIVERY_PATHS.COMPLETED,
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => StreamlineCompletedModule,
      },
      {
        path: DELIVERY_PATHS.DISPUTE,
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => CreateDisputeModule,
      },
      // TODO: change to STREAMLINE when opening production		Date: 2021/12/22
      {
        path: '**',
        redirectTo: DELIVERY_PATHS.ADDRESS,
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

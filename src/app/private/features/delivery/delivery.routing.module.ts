import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { DeliveryComponent } from './pages/delivery.component';
import { TransactionTrackingScreenModule } from './pages/transaction-tracking-screen/transaction-tracking-screen';
import { PayviewModule } from './pages/payview/payview.module';

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

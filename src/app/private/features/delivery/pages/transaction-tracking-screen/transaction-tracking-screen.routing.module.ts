import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import {
  TransactionTrackingBarcodeModule,
  TransactionTrackingInstructionsModule,
  TransactionTrackingOverviewModule,
  TransactionTrackingScreenComponent,
  TRANSACTION_TRACKING_PATHS,
} from '@private/features/delivery/pages/transaction-tracking-screen';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingScreenComponent,
    children: [
      {
        path: `${TRANSACTION_TRACKING_PATHS.BARCODE}/:${DELIVERY_PATH_PARAMS.BARCODE}`,
        loadChildren: () => TransactionTrackingBarcodeModule,
      },
      {
        path: `:${DELIVERY_PATH_PARAMS.ID}/${TRANSACTION_TRACKING_PATHS.INSTRUCTIONS}/:${DELIVERY_PATH_PARAMS.TYPE}`,
        loadChildren: () => TransactionTrackingInstructionsModule,
      },
      {
        path: `:${DELIVERY_PATH_PARAMS.ID}`,
        loadChildren: () => TransactionTrackingOverviewModule,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionTrackingScreenRoutingModule {}

export const transactionTrackingScreenRoutedComponents = [TransactionTrackingScreenComponent];

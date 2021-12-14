import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { TransactionTrackingBarcodeComponent } from '@private/features/delivery/pages/transaction-tracking-screen';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingBarcodeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionTrackingBarcodeRoutingModule {}

export const transactionTrackingBarcodeRoutedComponents = [TransactionTrackingBarcodeComponent];

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { TransactionTrackingInstructionsComponent } from '@private/features/delivery/pages/transaction-tracking-screen';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingInstructionsComponent,
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
export class TransactionTrackingInstructionsRoutingModule {}

export const transactionTrackingInstructionsRoutedComponents = [TransactionTrackingInstructionsComponent];

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview/transaction-tracking-overview.component';
import { TRANSACTION_TRACKING_PATHS } from './transaction-tracking-screen-routing-constants';
import { TransactionTrackingScreenComponent } from './transaction-tracking-screen.component';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingScreenComponent,
    children: [
      {
        path: '',
        loadChildren: () => TransactionTrackingOverviewComponent,
      },
      {
        path: TRANSACTION_TRACKING_PATHS.INFO,
        loadChildren: () =>
          import(
            '@private/features/delivery/modals/transaction-tracking-screen/transaction-tracking-instructions/transaction-tracking-instructions.module'
          ).then((m) => m.TransactionTrackingInstructionsModule),
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

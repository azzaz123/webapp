import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TransactionTrackingInstructionsModule } from './modals/transaction-tracking-instructions/transaction-tracking-instructions.module';
import { TransactionTrackingOverviewModule } from './transaction-tracking-overview/transaction-tracking-overview.module';
import { TRANSACTION_TRACKING_PATHS } from './transaction-tracking-screen-routing-constants';
import { TransactionTrackingScreenComponent } from './transaction-tracking-screen.component';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingScreenComponent,
    children: [
      {
        path: '',
        loadChildren: () => TransactionTrackingOverviewModule,
      },
      {
        path: TRANSACTION_TRACKING_PATHS.INSTRUCTIONS,
        loadChildren: () => TransactionTrackingInstructionsModule,
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

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview/transaction-tracking-overview.component';
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

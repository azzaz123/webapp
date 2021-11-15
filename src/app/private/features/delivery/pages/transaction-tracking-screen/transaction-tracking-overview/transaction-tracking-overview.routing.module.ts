import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TransactionTrackingOverviewComponent } from './transaction-tracking-overview.component';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingOverviewComponent,
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
export class TransactionTrackingOverviewRoutingModule {}

export const transactionTrackingOverviewRoutedComponents = [TransactionTrackingOverviewComponent];

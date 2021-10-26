import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TransactionTrackingScreenComponent } from './transaction-tracking-screen.component';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionTrackingScreenRoutingModule {}

export const transactionTrackingScreenRoutedComponents = [TransactionTrackingScreenComponent];

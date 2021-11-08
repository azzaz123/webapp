import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TransactionTrackingInstructionsComponent } from './transaction-tracking-instructions.component';

const routes: Route[] = [
  {
    path: '',
    component: TransactionTrackingInstructionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionTrackingInstructionsRoutingModule {}

export const TransactionTrackingInstructionsRoutedComponents = [TransactionTrackingInstructionsComponent];

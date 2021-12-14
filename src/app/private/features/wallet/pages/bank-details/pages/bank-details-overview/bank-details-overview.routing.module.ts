import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BankDetailsOverviewComponent } from './bank-details-overview.component';

const routes: Route[] = [
  {
    path: '',
    component: BankDetailsOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankDetailsOverviewRoutingModule {}

export const bankDetailsOverviewRoutedComponents = [BankDetailsOverviewComponent];

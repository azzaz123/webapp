import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BankDetailsComponent } from './bank-details.component';

const routes: Route[] = [
  {
    path: '',
    component: BankDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankDetailsRoutingModule {}

export const bankDetailsRoutedComponents = [BankDetailsComponent];

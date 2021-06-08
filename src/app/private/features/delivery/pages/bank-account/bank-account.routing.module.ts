import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BankAccountComponent } from './bank-account.component';

const routes: Route[] = [
  {
    path: '',
    component: BankAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountRoutingModule {}

export const bankAccountRoutedComponents = [BankAccountComponent];

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

// TODO: Add BankAccountComponent when created		Date: 2021/04/26
const routes: Route[] = [
  {
    path: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountRoutingModule {}

export const bankAccountRoutedComponents = [];

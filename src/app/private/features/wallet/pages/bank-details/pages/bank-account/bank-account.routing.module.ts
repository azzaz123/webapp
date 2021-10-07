import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { BankAccountComponent } from './bank-account.component';

const routes: Route[] = [
  {
    path: '',
    component: BankAccountComponent,
    canDeactivate: [ExitConfirmGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountRoutingModule {}

export const bankAccountRoutedComponents = [BankAccountComponent];

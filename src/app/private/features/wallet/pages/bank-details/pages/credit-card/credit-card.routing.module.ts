import { Route, RouterModule } from '@angular/router';
import { CreditCardComponent } from './credit-card.component';
import { NgModule } from '@angular/core';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';

const routes: Route[] = [
  {
    path: '',
    component: CreditCardComponent,
    canDeactivate: [ExitConfirmGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardRoutingModule {}

export const creditCardRoutedComponents = [CreditCardComponent];

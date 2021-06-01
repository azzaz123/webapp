import { Route, RouterModule } from '@angular/router';
import { CreditCardComponent } from './credit-card.component';
import { NgModule } from '@angular/core';

const routes: Route[] = [
  {
    path: '',
    component: CreditCardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditCardRoutingModule {}

export const creditCardRoutedComponents = [CreditCardComponent];

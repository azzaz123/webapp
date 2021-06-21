import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { BankAccountModule } from './pages/bank-account/bank-account.module';
import { CreditCardModule } from './pages/credit-card/credit-card.module';
import { BankDetailsComponent } from './bank-details.component';
import { BankDetailsOverviewModule } from './pages/bank-details-overview/bank-details-overview.module';

const routes: Route[] = [
  {
    path: '',
    component: BankDetailsComponent,
    children: [
      {
        path: DELIVERY_PATHS.CREDIT_CARD,
        loadChildren: () => CreditCardModule,
      },
      {
        path: DELIVERY_PATHS.BANK_ACCOUNT,
        loadChildren: () => BankAccountModule,
      },
      {
        path: '**',
        loadChildren: () => BankDetailsOverviewModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankDetailsRoutingModule {}

export const bankDetailsRoutedComponents = [BankDetailsComponent];

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BankAccountModule } from './pages/bank-account/bank-account.module';
import { CreditCardModule } from './pages/credit-card/credit-card.module';
import { BankDetailsComponent } from './bank-details.component';
import { BankDetailsOverviewModule } from './pages/bank-details-overview/bank-details-overview.module';
import { WALLET_PATHS } from '../../wallet-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: BankDetailsComponent,
    children: [
      {
        path: '',
        loadChildren: () => BankDetailsOverviewModule,
      },
      {
        path: WALLET_PATHS.CREDIT_CARD,
        loadChildren: () => CreditCardModule,
      },
      {
        path: WALLET_PATHS.BANK_ACCOUNT,
        loadChildren: () => BankAccountModule,
      },
      {
        path: '**',
        redirectTo: '',
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

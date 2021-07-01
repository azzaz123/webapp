import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BankDetailsOverviewModule } from './pages/bank-details/pages/bank-details-overview/bank-details-overview.module';
import { WalletComponent } from './pages/wallet.component';
import { WalletOverviewModule } from './pages/wallet-overview/wallet-overview.module';
import { WALLET_PATHS } from './wallet-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: WalletComponent,
    children: [
      {
        path: '',
        loadChildren: () => WalletOverviewModule,
      },
      {
        path: WALLET_PATHS.BANK_DETAILS,
        loadChildren: () => BankDetailsOverviewModule,
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
export class WalletRoutingModule {}

export const WalletRoutedComponents = [WalletComponent];

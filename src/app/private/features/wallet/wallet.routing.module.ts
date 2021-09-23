import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletBalanceModule } from './pages/wallet-balance/wallet-balance.module';
import { WALLET_PATHS } from './wallet.routing.constants';
import { BankDetailsModule } from './pages/bank-details/bank-details.module';
import { WalletComponent } from './wallet.component';
import { WalletResolver } from '@core/wallet/resolvers/wallet.resolver';

const routes: Route[] = [
  {
    path: '',
    resolve: {
      walletResolver: WalletResolver,
    },
    component: WalletComponent,
    children: [
      {
        path: '',
        redirectTo: WALLET_PATHS.BALANCE,
      },
      {
        path: WALLET_PATHS.BALANCE,
        loadChildren: () => WalletBalanceModule,
      },
      {
        path: WALLET_PATHS.BANK_DETAILS,
        loadChildren: () => BankDetailsModule,
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

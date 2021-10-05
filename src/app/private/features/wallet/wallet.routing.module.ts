import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletBalanceModule } from './pages/wallet-balance/wallet-balance.module';
import { WALLET_PATHS } from './wallet.routing.constants';
import { BankDetailsModule } from './pages/bank-details/bank-details.module';
import { WalletComponent } from './wallet.component';
import { WalletHistoryMovementsModule } from './pages/wallet-history-movements/wallet-history-movements.module';

const routes: Route[] = [
  {
    path: '',
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
        path: WALLET_PATHS.HISTORY,
        loadChildren: () => WalletHistoryMovementsModule,
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

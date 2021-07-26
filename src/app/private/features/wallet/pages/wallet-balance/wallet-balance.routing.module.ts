import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { KYCGuard } from '../../guards/kyc/kyc.guard';
import { WALLET_PATHS } from '../../wallet.routing.constants';
import { WalletBalanceComponent } from './wallet-balance.component';

const routes: Route[] = [
  {
    path: '',
    component: WalletBalanceComponent,
    children: [
      {
        path: WALLET_PATHS.KYC,
        loadChildren: () => import('@private/features/wallet/modals/kyc/kyc.module').then((m) => m.KYCModule),
        canActivate: [KYCGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletBalanceRoutingModule {}

export const walletBalanceRoutedComponents = [WalletBalanceComponent];

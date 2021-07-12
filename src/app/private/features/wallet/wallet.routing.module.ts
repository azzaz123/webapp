import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletComponent } from './pages/wallet.component';
import { WalletOverviewModule } from './pages/wallet-overview/wallet-overview.module';
import { WALLET_PATHS } from './wallet-routing-constants';
import { BankDetailsModule } from './pages/bank-details/bank-details.module';
import { KYCModule } from './pages/kyc/kyc.module';
import { KycGuard } from './guards/kyc/kyc.guard';

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
        loadChildren: () => BankDetailsModule,
      },
      {
        path: WALLET_PATHS.KYC,
        loadChildren: () => KYCModule,
        canActivate: [KycGuard],
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

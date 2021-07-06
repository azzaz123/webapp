import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletBalanceComponent } from './wallet-balance.component';

const routes: Route[] = [
  {
    path: '',
    component: WalletBalanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletBalanceRoutingModule {}

export const WalletBalanceRoutedComponents = [WalletBalanceComponent];

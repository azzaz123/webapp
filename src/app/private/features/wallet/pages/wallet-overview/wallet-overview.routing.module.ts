import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletOverviewComponent } from './wallet-overview.component';

const routes: Route[] = [
  {
    path: '',
    component: WalletOverviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletOverviewRoutingModule {}

export const WalletOverviewRoutedComponents = [WalletOverviewComponent];

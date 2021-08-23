import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletHistoryMovementsComponent } from './wallet-history-movements.component';

const routes: Route[] = [
  {
    path: '',
    component: WalletHistoryMovementsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletHistoryMovementsRoutingModule {}

export const walletHistoryMovementsRoutedComponents = [WalletHistoryMovementsComponent];

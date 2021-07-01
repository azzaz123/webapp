import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WalletComponent } from './wallet.component';

const routes: Route[] = [
  {
    path: '',
    component: WalletComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}

export const WalletRoutedComponents = [WalletComponent];

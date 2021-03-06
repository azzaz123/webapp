import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '../../../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { WallacoinsComponent } from './pages/wallacoins.component';

const routes: Route[] = [
  {
    path: '',
    component: WallacoinsComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallacoinsRoutingModule {}

export const wallacoinsRoutedComponents = [WallacoinsComponent];

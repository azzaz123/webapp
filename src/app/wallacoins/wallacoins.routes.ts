import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { WallacoinsComponent } from './wallacoins.component';

const routes: Routes = [
  {
    path: 'wallacoins',
    component: WallacoinsComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        only: PERMISSIONS.normal,
        redirectTo: '/pro/profile'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallacoinsRoutingModule {
}

export const wallacoinsRoutedComponents = [WallacoinsComponent];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { WallacoinsComponent } from './wallacoins.component';

const routes: Routes = [
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

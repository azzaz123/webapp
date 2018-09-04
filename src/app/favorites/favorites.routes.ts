import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      isMyZone: true,
      permissions: {
        only: PERMISSIONS.normal,
        redirectTo: '/pro/profile'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritesRoutingModule { }

export const favoritesRoutedComponents = [
  FavoritesComponent
];

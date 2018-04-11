import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { PERMISSIONS } from '../core/user/user';

const routes: Routes = [
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [LoggedGuard],
    data: {
      isMyZone: true
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

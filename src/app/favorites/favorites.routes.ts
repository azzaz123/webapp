import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { LoggedGuard } from '../core/user/logged.guard';

const routes: Routes = [
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [LoggedGuard]
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

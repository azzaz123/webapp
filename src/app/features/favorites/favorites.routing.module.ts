import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './pages/favorites.component';
import { LoggedGuard } from '@core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ProfileCardFavoriteComponent } from './components/profile-card-favorite/profile-card-favorite.component';
import { ItemCartFavoriteComponent } from './components/item-cart-favorite/item-cart-favorite.component';
import { PERMISSIONS } from '@core/user/user';
import { ExitConfirmGuard } from '@shared/guards/exit-confirm.guard';
import { ItemsPageComponent } from './components/items-page/items-page.component';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [LoggedGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      {
        path: 'products',
        component: ItemsPageComponent,
      },
      {
        path: 'profiles',
        component: ProfileCardFavoriteComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule {}

export const favoritesRoutedComponents = [
  FavoritesComponent,
  ItemCartFavoriteComponent,
  ProfileCardFavoriteComponent,
  ItemsPageComponent,
];

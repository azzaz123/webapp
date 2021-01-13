import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { FavoritesComponent } from './pages/favorites.component';
import { LoggedGuard } from '@core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ProfileCardFavoriteComponent } from './components/profile-card-favorite/profile-card-favorite.component';
import { ItemCartFavoriteComponent } from './components/item-cart-favorite/item-cart-favorite.component';
import { ExitConfirmGuard } from '@shared/guards/exit-confirm.guard';
import { ItemsPageComponent } from './components/items-page/items-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { APP_PATHS } from 'app/app-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [LoggedGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: APP_PATHS.PRODUCTS },
      {
        path: APP_PATHS.PRODUCTS,
        component: ItemsPageComponent,
      },
      {
        path: APP_PATHS.PROFILES,
        component: ProfilesPageComponent,
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
  ProfilesPageComponent,
];

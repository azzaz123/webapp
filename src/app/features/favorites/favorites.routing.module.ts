import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { FavoritesComponent } from './pages/favorites.component';
import { LoggedGuard } from '@core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ProfileCardFavoriteComponent } from './components/profile-card-favorite/profile-card-favorite.component';
import { ItemCardFavoriteComponent } from './components/item-card-favorite/item-card-favorite.component';
import { ExitConfirmGuard } from '@shared/guards/exit-confirm.guard';
import { ItemsPageComponent } from './components/items-page/items-page.component';
import { ProfilesPageComponent } from './components/profiles-page/profiles-page.component';
import { FAVORITES_PATHS } from './favorites-routing-constan';

const routes: Route[] = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [LoggedGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: FAVORITES_PATHS.PRODUCTS },
      {
        path: FAVORITES_PATHS.PRODUCTS,
        component: ItemsPageComponent,
      },
      {
        path: FAVORITES_PATHS.PROFILES,
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
  ItemCardFavoriteComponent,
  ProfileCardFavoriteComponent,
  ItemsPageComponent,
  ProfilesPageComponent,
];

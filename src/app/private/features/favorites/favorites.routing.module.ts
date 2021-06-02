import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { FavoritesComponent } from './pages/favorites.component';
import { LoggedGuard } from '@core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';

const routes: Route[] = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      isMyZone: true,
      permissions: {
        except: PERMISSIONS.professional,
        redirectTo: '/pro/profile',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule {}

export const favoritesRoutedComponents = [FavoritesComponent];

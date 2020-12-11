import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './favorites.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { ItemCartFavoriteComponent } from './item-cart-favorite/item-cart-favorite.component';
import { ProfileCardFavoriteComponent } from './profile-card-favorite/profile-card-favorite.component';
import { ExitConfirmGuard } from '@shared/guards/exit-confirm.guard';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
   /*  canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard], */
    data: {
      isMyZone: true,
      permissions: {
        except: PERMISSIONS.professional,
        redirectTo: '/pro/profile',
      }
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'items' },
      {
        path: 'favorites/items',
        component: ItemCartFavoriteComponent,
      },
      {
        path: 'favorites/profile',
        component: ProfileCardFavoriteComponent,
      }
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesRoutingModule { }

export const favoritesRoutedComponents = [FavoritesComponent];

import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from './core/user/user';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
  {
    path: 'pro',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'help',
        loadChildren: 'app/help/help.module#HelpModule'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'calls',
        loadChildren: 'app/calls/calls.module#CallsModule'
      },
      {
        path: 'catalog',
        children: [
          {
            path: '',
            loadChildren: 'app/catalog-pro/catalog-pro.module#CatalogProModule'
          },
          {
            path: 'upload',
            loadChildren: 'app/upload/upload.module#UploadModule',
            canLoad: [NgxPermissionsGuard],
            data: {
              isMyZone: true,
              isProducts: true,
              permissions: {
                only: PERMISSIONS.professional,
                redirectTo: '/catalog/upload'
              }
            }
          },
          {
            path: 'edit',
            loadChildren: 'app/upload/upload.module#UploadModule'
          }
        ]
      }
    ]
  },
  {
    path: 'profile',
    loadChildren: 'app/profile/profile.module#ProfileModule'
  },
  {
    path: 'chat',
    loadChildren: 'app/chat/chat.module#ChatModule'
  },
  {
    path: 'favorites',
    loadChildren: 'app/favorites/favorites.module#FavoritesModule'
  },
  {
    path: 'reviews',
    loadChildren: 'app/reviews/reviews.module#ReviewsModule'
  },
  {
    path: 'wallacoins',
    loadChildren: 'app/wallacoins/wallacoins.module#WallacoinsModule'
  },
  {
    path: 'tutorial',
    loadChildren: 'app/tutorial/tutorial.module#TutorialModule'
  },
  {
    path: 'catalog',
    children: [
      {
        path: '',
        loadChildren: 'app/catalog/catalog.module#CatalogModule'
      },
      {
        path: 'upload',
        loadChildren: 'app/upload/upload.module#UploadModule',
        canLoad: [NgxPermissionsGuard],
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.normal,
            redirectTo: '/pro/catalog/upload'
          }
        }
      },
      {
        path: 'edit',
        loadChildren: 'app/upload/upload.module#UploadModule'
      }
    ]
  },
  {
    path: 'login',
    loadChildren: 'app/login/login.module#LoginModule'
  },
  {
    path: 'stats',
    loadChildren: 'app/stats/stats.module#StatsModule'
  },
  {
    path: '**', redirectTo: 'chat'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}

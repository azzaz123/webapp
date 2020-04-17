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
        loadChildren: () => import('app/help/help.module').then(m => m.HelpModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('app/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'calls',
        loadChildren: () => import('app/calls/calls.module').then(m => m.CallsModule)
      },
      {
        path: 'catalog',
        children: [
          {
            path: '',
            loadChildren: () => import('app/catalog-pro/catalog-pro.module').then(m => m.CatalogProModule)
          },
          {
            path: 'upload',
            loadChildren: () => import('app/upload/upload.module').then(m => m.UploadModule),
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
            loadChildren: () => import('app/upload/upload.module').then(m => m.UploadModule)
          }
        ]
      }
    ]
  },
  {
    path: 'profile',
    loadChildren: () => import('app/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('app/chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('app/favorites/favorites.module').then(m => m.FavoritesModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('app/reviews/reviews.module').then(m => m.ReviewsModule)
  },
  {
    path: 'wallacoins',
    loadChildren: () => import('app/wallacoins/wallacoins.module').then(m => m.WallacoinsModule)
  },
  {
    path: 'catalog',
    children: [
      {
        path: '',
        loadChildren: () => import('app/catalog/catalog.module').then(m => m.CatalogModule)
      },
      {
        path: 'upload',
        loadChildren: () => import('app/upload/upload.module').then(m => m.UploadModule),
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
        loadChildren: () => import('app/upload/upload.module').then(m => m.UploadModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('app/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('app/stats/stats.module').then(m => m.StatsModule)
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

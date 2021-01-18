import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from '@core/user/user';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CheckUserPermissionsResolver } from './core/resolvers/check-user-permissions.resolver';
import { PrivateComponent } from './private.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: 'pro',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'help',
            loadChildren: () =>
              import('app/features/help/help.module').then((m) => m.HelpModule),
          },
          {
            path: 'dashboard',
            loadChildren: () =>
              import('app/features/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
          {
            path: 'calls',
            loadChildren: () =>
              import('app/features/calls/calls.module').then(
                (m) => m.CallsModule
              ),
          },
          {
            path: 'catalog',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('app/features/catalog-pro/catalog-pro.module').then(
                    (m) => m.CatalogProModule
                  ),
              },
              {
                path: 'upload',
                loadChildren: () =>
                  import('@features/upload/upload.module').then(
                    (m) => m.UploadModule
                  ),
                canLoad: [NgxPermissionsGuard],
                data: {
                  isMyZone: true,
                  isProducts: true,
                  permissions: {
                    only: PERMISSIONS.professional,
                    redirectTo: '/catalog/upload',
                  },
                },
              },
              {
                path: 'edit',
                loadChildren: () =>
                  import('@features/upload/upload.module').then(
                    (m) => m.UploadModule
                  ),
              },
            ],
          },
        ],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('app/features/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('app/features/chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'favorites',
        loadChildren: () =>
          import('app/features/favorites/favorites.module').then(
            (m) => m.FavoritesModule
          ),
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('app/features/reviews/reviews.module').then(
            (m) => m.ReviewsModule
          ),
      },
      {
        path: 'wallacoins',
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: '/pro/catalog/list',
          },
        },
        redirectTo: 'catalog/list;disableWallacoinsModal=true',
      },
      {
        path: 'catalog',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('app/features/catalog/catalog.module').then(
                (m) => m.CatalogModule
              ),
          },
          {
            path: 'upload',
            loadChildren: () =>
              import('@features/upload/upload.module').then(
                (m) => m.UploadModule
              ),
            canLoad: [NgxPermissionsGuard],
            data: {
              isMyZone: true,
              isProducts: true,
              permissions: {
                except: PERMISSIONS.professional,
                redirectTo: '/pro/catalog/upload',
              },
            },
          },
          {
            path: 'edit',
            loadChildren: () =>
              import('@features/upload/upload.module').then(
                (m) => m.UploadModule
              ),
          },
        ],
      },
      {
        path: 'stats',
        loadChildren: () =>
          import('app/features/stats/stats.module').then((m) => m.StatsModule),
      },
      {
        path: '**',
        redirectTo: 'chat',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}

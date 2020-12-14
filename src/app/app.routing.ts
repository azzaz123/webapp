import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { PERMISSIONS } from './core/user/user';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DevelopmentGuard } from './core/user/development.guard';
import { LoggedGuard } from './core/user/logged.guard';
import { PATH_EVENTS } from './app-routing-constants';

const publicRoute: Route = {
  path: 'public',
  canLoad: [DevelopmentGuard],
  loadChildren: () =>
    import('@public/public.module').then((m) => m.PublicModule),
  data: {
    [PATH_EVENTS.hideSidebar]: true,
  },
};

const loggedRoutes = [
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
  {
    path: 'pro',
    canActivate: [LoggedGuard],
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
          import('app/features/calls/calls.module').then((m) => m.CallsModule),
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
              import('app/upload/upload.module').then((m) => m.UploadModule),
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
              import('app/upload/upload.module').then((m) => m.UploadModule),
          },
        ],
      },
    ],
  },
  {
    path: 'profile',
    canLoad: [LoggedGuard],
    loadChildren: () =>
      import('app/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'chat',
    canLoad: [LoggedGuard],
    loadChildren: () =>
      import('app/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: 'favorites',
    canLoad: [LoggedGuard],
    loadChildren: () =>
      import('app/features/favorites/favorites.module').then(
        (m) => m.FavoritesModule
      ),
  },
  {
    path: 'reviews',
    canLoad: [LoggedGuard],
    loadChildren: () =>
      import('app/features/reviews/reviews.module').then(
        (m) => m.ReviewsModule
      ),
  },
  {
    path: 'wallacoins',
    canLoad: [LoggedGuard, NgxPermissionsGuard],
    data: {
      permissions: {
        except: PERMISSIONS.professional,
        redirectTo: '/pro/catalog/list',
      },
    },
    loadChildren: () =>
      import('app/features/wallacoins/wallacoins.module').then(
        (m) => m.WallacoinsModule
      ),
  },
  {
    path: 'catalog',
    canActivate: [LoggedGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('app/catalog/catalog.module').then((m) => m.CatalogModule),
      },
      {
        path: 'upload',
        loadChildren: () =>
          import('app/upload/upload.module').then((m) => m.UploadModule),
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
          import('app/upload/upload.module').then((m) => m.UploadModule),
      },
    ],
  },
  {
    path: 'stats',
    canLoad: [LoggedGuard],
    loadChildren: () =>
      import('app/features/stats/stats.module').then((m) => m.StatsModule),
  },
  {
    path: '**',
    redirectTo: 'chat',
  },
];

const routes: Routes = [publicRoute, ...loggedRoutes];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

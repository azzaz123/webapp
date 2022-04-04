import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PATH_TO_ACCEPT_SCREEN, PRIVATE_PATHS, PRIVATE_PATH_PARAMS } from './private-routing-constants';
import { PrivateComponent } from './private.component';
import { PERMISSIONS } from '@core/user/user-constants';
import { PRO_PATHS } from './features/pro/pro-routing-constants';
import { DevelopmentGuard } from '@core/user/development.guard';
import { PROFILE_PATHS } from './features/profile/profile-routing-constants';
import { CATALOG_PATHS } from './features/catalog/catalog-routing-constants';
import { YouGuard } from './features/you/guards/you.guard';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: `${PRIVATE_PATHS.ACCEPT_SCREEN}/:${PRIVATE_PATH_PARAMS.ID}`,
        redirectTo: `${PATH_TO_ACCEPT_SCREEN}/:${PRIVATE_PATH_PARAMS.ID}`,
      },
      {
        path: 'pro',
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
          {
            path: 'help',
            loadChildren: () => import('@private/features/help/help.module').then((m) => m.HelpModule),
          },
          {
            path: 'dashboard',
            loadChildren: () => import('@private/features/dashboard/dashboard.module').then((m) => m.DashboardModule),
          },
          {
            path: 'calls',
            loadChildren: () => import('@private/features/calls/calls.module').then((m) => m.CallsModule),
          },
          {
            path: 'catalog',
            children: [
              {
                path: '',
                loadChildren: () => import('@private/features/catalog-pro/catalog-pro.module').then((m) => m.CatalogProModule),
              },
              {
                path: CATALOG_PATHS.UPLOAD,
                loadChildren: () => import('@private/features/upload/upload.module').then((m) => m.UploadModule),
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
                path: CATALOG_PATHS.EDIT,
                loadChildren: () => import('@private/features/upload/upload.module').then((m) => m.UploadModule),
              },
            ],
          },
        ],
      },
      {
        path: PRIVATE_PATHS.PROFILE,
        loadChildren: () => import('@private/features/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: PRO_PATHS.PRO_MANAGER,
        loadChildren: () => import('@private/features/pro/pro.module').then((m) => m.ProModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: PERMISSIONS.subscriptions,
            redirectTo: PRIVATE_PATHS.PROFILE,
          },
        },
      },
      {
        path: PRIVATE_PATHS.CHAT,
        loadChildren: () => import('@private/features/inbox/inbox-page.module').then((m) => m.InboxPageModule),
      },
      {
        path: 'favorites',
        loadChildren: () => import('@private/features/favorites/favourites.module').then((m) => m.FavouritesModule),
      },
      {
        path: 'reviews',
        loadChildren: () => import('@private/features/reviews/reviews.module').then((m) => m.ReviewsModule),
      },
      {
        path: PRIVATE_PATHS.BUMPS,
        loadChildren: () => import('@private/features/bumps/bumps.module').then((m) => m.BumpsModule),
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
        path: PRIVATE_PATHS.CATALOG,
        children: [
          {
            path: '',
            loadChildren: () => import('@private/features/catalog/catalog.module').then((m) => m.CatalogModule),
          },
          {
            path: CATALOG_PATHS.UPLOAD,
            loadChildren: () => import('@private/features/upload/upload.module').then((m) => m.UploadModule),
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
            path: CATALOG_PATHS.EDIT,
            loadChildren: () => import('@private/features/upload/upload.module').then((m) => m.UploadModule),
          },
        ],
      },
      {
        path: 'stats',
        loadChildren: () => import('@private/features/stats/stats.module').then((m) => m.StatsModule),
      },
      {
        path: PRIVATE_PATHS.DELIVERY,
        loadChildren: () => import('@private/features/delivery/delivery.module').then((m) => m.DeliveryModule),
      },
      {
        // TODO: Change the guard to the wallet one when created		Date: 2021/07/01
        path: PRIVATE_PATHS.WALLET,
        loadChildren: () => import('@private/features/wallet/wallet.module').then((m) => m.WalletModule),
      },
      {
        path: PRIVATE_PATHS.VERIFICATION,
        canLoad: [DevelopmentGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: `/${PRIVATE_PATHS.CHAT}` },
          { path: 'view', redirectTo: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}` },
        ],
      },
      {
        path: PRIVATE_PATHS.YOU,
        canLoad: [YouGuard],
        loadChildren: () => import('@private/features/you/you.module').then((m) => m.YouModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}

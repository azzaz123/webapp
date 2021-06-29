import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryDevelopmentGuard } from './features/delivery/guards/delivery-development.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PRIVATE_PATHS } from './private-routing-constants';
import { PrivateComponent } from './private.component';
import { PERMISSIONS } from '@core/user/user-constants';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('@private/features/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'pro',
        loadChildren: () => import('@private/features/pro/pro.module').then((m) => m.ProModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: PERMISSIONS.subscriptions,
            redirectTo: 'profile',
          },
        },
      },
      {
        path: 'chat',
        loadChildren: () => import('@private/features/chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'favorites',
        loadChildren: () => import('@private/features/favorites/favorites.module').then((m) => m.FavoritesModule),
      },
      {
        path: 'reviews',
        loadChildren: () => import('@private/features/reviews/reviews.module').then((m) => m.ReviewsModule),
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
            loadChildren: () => import('@private/features/catalog/catalog.module').then((m) => m.CatalogModule),
          },
          {
            path: 'upload',
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
            path: 'edit',
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
        canLoad: [DeliveryDevelopmentGuard],
        loadChildren: () => import('@private/features/delivery/delivery.module').then((m) => m.DeliveryModule),
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

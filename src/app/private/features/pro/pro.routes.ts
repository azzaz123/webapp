import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user-constants';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SubscriptionsComponent } from './pages/subscription/subscription.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ProfileProSubscriptionComponent } from './pages/profile-pro-subscription/profile-pro-subscription.component';
import { ProComponent } from './pages/pro.component';
import { PRO_PATHS } from './pro-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: ProComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: PRO_PATHS.SUBSCRIPTIONS },
      {
        path: PRO_PATHS.SUBSCRIPTIONS,
        component: SubscriptionsComponent,
        data: {
          isMyZone: true,
          isProfile: true,
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: '/profile',
          },
        },
      },
      {
        path: PRO_PATHS.BILLING,
        component: InvoiceComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: PRO_PATHS.SUBSCRIPTIONS_PRO,
        component: ProfileProSubscriptionComponent,
        data: {
          isMyZone: true,
          isProfile: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/profile',
          },
        },
      },
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
            path: 'upload',
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
            path: 'edit',
            loadChildren: () => import('@private/features/upload/upload.module').then((m) => m.UploadModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProRoutingModule {}

export const proRoutedComponents = [SubscriptionsComponent, ProfileProSubscriptionComponent, InvoiceComponent];

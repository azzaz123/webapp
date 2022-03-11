import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { InboxPageComponent } from './pages/inbox-page.component';
import { LoggedGuard } from '@core/user/logged.guard';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { PRIVATE_PATH_PARAMS, PRIVATE_PATHS } from '@private/private-routing-constants';
import { DeliveryDevelopmentGuard } from '@private/features/delivery/guards/delivery-development.guard';

const routes: Route[] = [
  {
    path: '',
    component: InboxPageComponent,
    children: [
      {
        path: PRIVATE_PATHS.NOTIFICATIONS,
        loadChildren: () =>
          import('@private/features/inbox/components/notifications-inbox/notifications-inbox.module').then(
            (m) => m.NotificationsInboxModule
          ),
        data: {
          title: 'Notifications',
        },
      },
      {
        path: '',
        loadChildren: () => import('@private/features/chat/chat.module').then((m) => m.ChatModule),
        canActivate: [LoggedGuard],
        resolve: {
          adsLoaded: AdsResolver,
        },
        data: {
          title: 'Messages',
        },
      },
    ],
  },
  {
    path: `${PRIVATE_PATHS.ACCEPT_SCREEN}/:${PRIVATE_PATH_PARAMS.ID}`,
    canLoad: [DeliveryDevelopmentGuard],
    loadChildren: () => import('@private/features/accept-screen/accept-screen.module').then((m) => m.AcceptScreenModule),
  },
  {
    path: `${PRIVATE_PATHS.PAYVIEW}/:${PRIVATE_PATH_PARAMS.ID}`,
    canLoad: [DeliveryDevelopmentGuard],
    loadChildren: () => import('@private/features/payview/payview.module').then((m) => m.PayviewModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InboxPageRoutingModule {}

export const inboxPageRoutedComponents = [InboxPageComponent];

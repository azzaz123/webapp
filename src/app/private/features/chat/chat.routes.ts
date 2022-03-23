import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { ChatComponent } from '@private/features/chat/chat.component';
import { DeliveryDevelopmentGuard } from '@private/features/delivery/guards/delivery-development.guard';
import { LoggedGuard } from '@core/user/logged.guard';
import { PRIVATE_PATHS, PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [LoggedGuard],
    resolve: {
      adsLoaded: AdsResolver,
    },
    data: {
      title: 'Chat',
    },
  },
  {
    path: `${PRIVATE_PATHS.ACCEPT_SCREEN}/:${PRIVATE_PATH_PARAMS.ID}`,
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
export class ChatRoutingModule {}

export const chatRoutedComponents = [ChatComponent];

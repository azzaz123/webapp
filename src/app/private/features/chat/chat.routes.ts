import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { LoggedGuard } from '@core/user/logged.guard';
import { PRIVATE_PATHS, PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { DeliveryDevelopmentGuard } from '../delivery/guards/delivery-development.guard';
import { ChatComponent } from './chat.component';

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
    canLoad: [DeliveryDevelopmentGuard],
    loadChildren: () => import('@private/features/accept-screen/accept-screen.module').then((m) => m.AcceptScreenModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}

export const chatRoutedComponents = [ChatComponent];

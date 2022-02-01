import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DeliveryDevelopmentGuard } from '@private/features/delivery/guards/delivery-development.guard';
import { PRIVATE_PATHS, PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { StreamlineOngoingComponent } from './streamline-ongoing.component';

const routes: Route[] = [
  {
    path: '',
    component: StreamlineOngoingComponent,
  },
  {
    path: `${PRIVATE_PATHS.ACCEPT_SCREEN}/:${PRIVATE_PATH_PARAMS.ID}`,
    canLoad: [DeliveryDevelopmentGuard],
    loadChildren: () => import('@private/features/accept-screen/accept-screen.module').then((m) => m.AcceptScreenModule),
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
export class StreamlineOngoingRoutingModule {}

export const streamlineOngoingRoutedComponents = [StreamlineOngoingComponent];

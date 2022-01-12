import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from './app-routing-constants';

const publicRoute: Route = {
  path: APP_PATHS.PUBLIC,
  loadChildren: () => import('@public/public.module').then((m) => m.PublicModule),
};

const privateRoute = {
  path: APP_PATHS.PRIVATE,
  canLoad: [LoggedGuard],
  loadChildren: () => import('@private/private.module').then((m) => m.PrivateModule),
};

const notFoundRoute = {
  path: '**',
  redirectTo: PUBLIC_PATHS.SEARCH,
};

const routes: Route[] = [publicRoute, privateRoute, notFoundRoute];

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

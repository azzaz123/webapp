import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { DevelopmentGuard } from './core/user/development.guard';
import { LoggedGuard } from '@core/user/logged.guard';
import { APP_PATHS } from './app-routing-constants';

const publicRoute: Route = {
  path: APP_PATHS.PUBLIC,
  canLoad: [DevelopmentGuard],
  loadChildren: () =>
    import('@public/public.module').then((m) => m.PublicModule),
};

const privateRoute = {
  path: APP_PATHS.PRIVATE,
  canLoad: [LoggedGuard],
  loadChildren: () =>
    import('@private/private.module').then((m) => m.PrivateModule),
};

const notFoundRoute: Route = {
  path: APP_PATHS.NOT_FOUND,
  canLoad: [DevelopmentGuard],
  loadChildren: () =>
    import('@features/error/error.module').then((m) => m.ErrorModule),
};

const routes: Route[] = [notFoundRoute, publicRoute, privateRoute];

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

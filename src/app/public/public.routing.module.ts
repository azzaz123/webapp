import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { DevelopmentGuard } from '@core/user/development.guard';
import { PUBLIC_PATHS, PUBLIC_PATH_PARAMS } from './public-routing-constants';
import { PublicComponent } from './public.component';

const routes: Route[] = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: PUBLIC_PATHS.SEARCH },
      {
        path: PUBLIC_PATHS.LOGIN,
        canLoad: [DevelopmentGuard],
        loadChildren: () => import('./features/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: PUBLIC_PATHS.REGISTER,
        canLoad: [DevelopmentGuard],
        loadChildren: () => import('./features/register/register.module').then((m) => m.RegisterModule),
      },
      {
        path: `${PUBLIC_PATHS.USER_DETAIL}/:${PUBLIC_PATH_PARAMS.WEBSLUG}`,
        loadChildren: () => import('./features/public-profile/public-profile.module').then((m) => m.PublicProfileModule),
      },
      {
        path: PUBLIC_PATHS.SEARCH,
        loadChildren: () => import('./features/search/search.module').then((m) => m.SearchModule),
      },
      {
        path: `${PUBLIC_PATHS.ITEM_DETAIL}/:${PUBLIC_PATH_PARAMS.ID}`,
        loadChildren: () => import('./features/item-detail/item-detail.module').then((m) => m.ItemDetailModule),
      },
      {
        path: PUBLIC_PATHS.NOT_FOUND,
        loadChildren: () => import('./features/error/error.module').then((m) => m.ErrorModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}

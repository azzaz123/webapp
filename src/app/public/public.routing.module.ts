import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { PUBLIC_PATHS, PUBLIC_PATH_PARAMS } from './public-routing-constants';
import { PublicComponent } from './public.component';

const routes: Route[] = [
  {
    path: '',
    component: PublicComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: PUBLIC_PATHS.LOGIN },
      {
        path: PUBLIC_PATHS.LOGIN,
        loadChildren: () =>
          import('./features/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: PUBLIC_PATHS.REGISTER,
        loadChildren: () =>
          import('./features/register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
      {
        path: `${PUBLIC_PATHS.USER_DETAIL}/:${PUBLIC_PATH_PARAMS.ID}`,
        loadChildren: () =>
          import('./features/public-profile/public-profile.module').then(
            (m) => m.PublicProfileModule
          ),
      },
      {
        path: PUBLIC_PATHS.SEARCH,
        loadChildren: () =>
          import('./features/search/search.module').then((m) => m.SearchModule),
      },
      {
        path: `${PUBLIC_PATHS.ITEM_DETAIL}/:${PUBLIC_PATH_PARAMS.ID}`,
        loadChildren: () =>
          import('./features/item-detail/item-detail.module').then(
            (m) => m.ItemDetailModule
          ),
      },
      {
        path: '**',
        redirectTo: PUBLIC_PATHS.LOGIN,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}

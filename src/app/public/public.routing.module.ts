import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { PUBLIC_PATHS } from './public-routing-constants';
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
        path: 'user/:id',
        loadChildren: () =>
          import('./features/public-profile/public-profile.module').then(
            (m) => m.PublicProfileModule
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

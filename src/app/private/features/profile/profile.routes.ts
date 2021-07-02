import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AccountComponent } from './pages/account/account.component';
import { ProfileInfoComponent } from './pages/profile-info/profile-info.component';
import { ProfileComponent } from './pages/profile.component';

const routes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      {
        path: 'info',
        component: ProfileInfoComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: 'account',
        component: AccountComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: 'subscriptions',
        redirectTo: '/pro/subscriptions',
      },
      {
        path: 'billing',
        redirectTo: '/pro/billing',
      },
      {
        path: 'subscription-pro',
        redirectTo: '/pro/subscription-pro',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}

export const profileRoutedComponents = [ProfileComponent, ProfileInfoComponent, AccountComponent];

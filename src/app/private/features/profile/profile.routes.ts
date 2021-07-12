import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AccountComponent } from './pages/account/account.component';
import { ProfileInfoComponent } from './pages/profile-info/profile-info.component';
import { ProfileComponent } from './pages/profile.component';
import { PRO_PATHS } from '../pro/pro-routing-constants';

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
        path: PRO_PATHS.SUBSCRIPTIONS,
        redirectTo: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`,
      },
      {
        path: PRO_PATHS.BILLING,
        redirectTo: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.BILLING}`,
      },
      {
        path: PRO_PATHS.SUBSCRIPTIONS_PRO,
        redirectTo: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS_PRO}`,
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

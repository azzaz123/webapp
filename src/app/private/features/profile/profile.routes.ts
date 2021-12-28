import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ProfileInfoComponent } from './pages/profile-info/profile-info.component';
import { ProfileComponent } from './pages/profile.component';
import { PRO_PATHS } from '../pro/pro-routing-constants';
import { VerificationsNScurityModule } from './pages/verifications-n-security/verifications-n-securty.module';
import { PROFILE_PATHS } from './profile-routing-constants';
import { AccountModule } from './pages/account/account.module';

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
      { path: '', pathMatch: 'full', redirectTo: PROFILE_PATHS.INFO },
      {
        path: PROFILE_PATHS.INFO,
        component: ProfileInfoComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: PROFILE_PATHS.ACCOUNT,
        loadChildren: () => AccountModule,
      },
      {
        path: PROFILE_PATHS.VERIFICATIONS,
        loadChildren: () => VerificationsNScurityModule,
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

export const profileRoutedComponents = [ProfileComponent, ProfileInfoComponent];

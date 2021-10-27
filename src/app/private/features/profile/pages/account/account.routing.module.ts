import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { PROFILE_PATHS } from '../../profile-routing-constants';
import { VERIFICATIONS_N_SECURITY_PATHS } from '../verifications-n-security/verifications-n-security.routing.constants';
import { AccountComponent } from './account.component';

const routes: Route[] = [
  {
    path: '',
    component: AccountComponent,
    canDeactivate: [ExitConfirmGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [
      {
        path: VERIFICATIONS_N_SECURITY_PATHS.VERIFY_EMAIL,
        redirectTo: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}/${VERIFICATIONS_N_SECURITY_PATHS.VERIFY_EMAIL}`,
      },
      {
        path: VERIFICATIONS_N_SECURITY_PATHS.CHANGE_EMAIL,
        redirectTo: `/${PRIVATE_PATHS.PROFILE}/${PROFILE_PATHS.VERIFICATIONS}/${VERIFICATIONS_N_SECURITY_PATHS.CHANGE_EMAIL}`,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

export const AccountRoutedComponents = [AccountComponent];

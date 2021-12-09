import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { VerificationsNSecurityComponent } from './verifications-n-security.component';
import { VERIFICATIONS_N_SECURITY_PATHS } from './verifications-n-security.routing.constants';

const routes: Route[] = [
  {
    path: '',
    component: VerificationsNSecurityComponent,
    children: [
      {
        path: VERIFICATIONS_N_SECURITY_PATHS.VERIFY_EMAIL,
        loadChildren: () =>
          import('@private/features/profile/modal/email-verification/email-verification.module').then((m) => m.EmailVerificationModule),
      },
      {
        path: VERIFICATIONS_N_SECURITY_PATHS.CHANGE_EMAIL,
        loadChildren: () => import('@private/features/profile/modal/change-email/change-email.module').then((m) => m.ChangeEmailModule),
      },
      {
        path: VERIFICATIONS_N_SECURITY_PATHS.VERIFY_PHONE,
        loadChildren: () =>
          import('@private/features/profile/modal/phone-verification/phone-verification.module').then((m) => m.PhoneVerificationModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationsNScurityRoutingModule {}

export const VerificationsNScurityRoutedComponents = [VerificationsNSecurityComponent];

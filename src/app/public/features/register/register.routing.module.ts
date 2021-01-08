import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RegisterComponent } from './pages/register.component';
import { SendVerifyEmailComponent } from './pages/send-verify-email/send-verify-email.component';
import { VerifyErrorComponent } from './pages/verify/verify-error/verify-error.component';
import { VerifySuccessComponent } from './pages/verify/verify-success/verify-success.component';
import { VerifyComponent } from './pages/verify/verify.component';

const routes: Route[] = [
  {
    path: '',
    component: RegisterComponent,
    children: [
      {
        path: '**',
        component: VerifyComponent,
      },
    ],
  },
];

export const registerRoutedComponents = [RegisterComponent, VerifyComponent];

export const registerNonroutedComponents = [
  SendVerifyEmailComponent,
  VerifySuccessComponent,
  VerifyErrorComponent,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyComponent } from './verify/verify.component';
import { SendVerifyEmailComponent } from './send-verify-email/send-verify-email.component';
import { RegisterComponent } from './register.component';
import { VerifySuccessComponent } from './verify/verify-success/verify-success.component';
import { VerifyErrorComponent } from './verify/verify-error/verify-error.component';

const routes: Routes = [
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

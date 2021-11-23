import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DevelopmentGuard } from '@core/user/development.guard';
import { EmailVerificationComponent } from './email-verification.component';

const routes: Route[] = [
  {
    path: '',
    component: EmailVerificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailVerificationRoutingModule {}

export const EmailVerificationRoutedComponents = [EmailVerificationComponent];

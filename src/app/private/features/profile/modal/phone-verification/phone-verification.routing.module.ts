import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PhoneVerificationComponent } from './phone-verification.component';

const routes: Route[] = [
  {
    path: '',
    component: PhoneVerificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneVerificationRoutingModule {}

export const PhoneVerificationRoutedComponents = [PhoneVerificationComponent];

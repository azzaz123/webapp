import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { VerificationsNSecurityComponent } from './verifications-n-security.component';

const routes: Route[] = [
  {
    path: '',
    component: VerificationsNSecurityComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationsNScurityRoutingModule {}

export const VerificationsNScurityRoutedComponents = [VerificationsNSecurityComponent];

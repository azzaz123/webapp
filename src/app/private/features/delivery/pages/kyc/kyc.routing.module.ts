import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { KycComponent } from './kyc.component';

const routes: Route[] = [
  {
    path: '',
    component: KycComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KYCRoutingModule {}

export const KYCRoutedComponents = [KycComponent];

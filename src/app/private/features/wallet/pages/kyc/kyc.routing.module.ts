import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { KYCComponent } from './kyc.component';

const routes: Route[] = [
  {
    path: '',
    component: KYCComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KYCRoutingModule {}

export const KYCRoutedComponents = [KYCComponent];

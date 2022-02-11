import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { PayviewComponent } from '@private/features/payview/components/payview/payview.component';

const routes: Route[] = [
  {
    path: '',
    component: PayviewComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayviewRoutingModule {}

export const payviewRoutedComponents = [PayviewComponent];

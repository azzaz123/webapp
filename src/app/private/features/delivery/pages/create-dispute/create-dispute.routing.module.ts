import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

// TODO: Add CreateDisputeComponent when created		Date: 2021/04/26
const routes: Route[] = [
  {
    path: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateDisputeRoutingModule {}

export const createDisputeRoutedComponents = [];

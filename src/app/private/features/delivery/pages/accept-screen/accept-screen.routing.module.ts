import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

// TODO: Add AcceptScreenComponent when created		Date: 2021/04/22
const routes: Route[] = [
  {
    path: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptScreenRoutingModule {}

export const acceptScreenRoutedComponents = [];
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AcceptScreenComponent } from './accept-screen.component';

// TODO: Add AcceptScreenComponent when created		Date: 2021/04/22
const routes: Route[] = [
  {
    path: '',
    component: AcceptScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptScreenRoutingModule {}

export const acceptScreenRoutedComponents = [AcceptScreenComponent];

import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AcceptScreenComponent } from './accept-screen.component';

const routes: Route[] = [
  {
    path: '',
    component: AcceptScreenComponent,
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
export class AcceptScreenRoutingModule {}

export const acceptScreenRoutedComponents = [AcceptScreenComponent];

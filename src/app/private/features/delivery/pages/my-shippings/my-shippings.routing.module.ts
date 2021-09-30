import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MyShippingsComponent } from './my-shippings.component';

const routes: Route[] = [
  {
    path: '',
    component: MyShippingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyShippingsTrackingRoutingModule {}

export const myShippingsRoutedComponents = [MyShippingsComponent];

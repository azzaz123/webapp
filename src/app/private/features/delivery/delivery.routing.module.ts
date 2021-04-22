import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DeliveryComponent } from './pages/delivery.component';

const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRoutingModule {}

export const deliveryRoutedComponents = [DeliveryComponent];

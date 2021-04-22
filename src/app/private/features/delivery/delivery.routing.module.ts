import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DELIVERY_PATHS } from './delivery-routing-constants';
import { DeliveryComponent } from './pages/delivery.component';
import { TrackingTimelineModule } from './pages/tracking-timeline/tracking-timeline.module';

const routes: Route[] = [
  {
    path: '',
    component: DeliveryComponent,
    children: [
      {
        path: DELIVERY_PATHS.TIMELINE,
        loadChildren: () => TrackingTimelineModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRoutingModule {}

export const deliveryRoutedComponents = [DeliveryComponent];

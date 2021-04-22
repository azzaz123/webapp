import { NgModule } from '@angular/core';
import { trackingTimelineRoutedComponents, TrackingTimelineRoutingModule } from './tracking-timeline.routing.module';

@NgModule({
  imports: [TrackingTimelineRoutingModule],
  declarations: [trackingTimelineRoutedComponents],
})
export class TrackingTimelineModule {}

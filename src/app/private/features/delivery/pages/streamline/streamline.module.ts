import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedErrorActionModule } from '@shared/error-action';
import { streamlineRoutedComponents, StreamlineRoutingModule } from './streamline.routing.module';
import { StreamlineTrackingEventsService } from '@private/features/delivery/pages/streamline/services/streamline-tracking-events/streamline-tracking-events.service';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';

@NgModule({
  imports: [StreamlineRoutingModule, TabsBarModule, RouterModule, SharedErrorActionModule],
  declarations: [streamlineRoutedComponents],
  providers: [StreamlineTrackingEventsService],
})
export class StreamlineModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { StreamlineTrackingEventsService } from './services/streamline-tracking-events/streamline-tracking-events.service';
import { streamlineRoutedComponents, StreamlineRoutingModule } from './streamline.routing.module';

@NgModule({
  imports: [StreamlineRoutingModule, TabsBarModule, RouterModule],
  declarations: [streamlineRoutedComponents],
  providers: [StreamlineTrackingEventsService],
})
export class StreamlineModule {}

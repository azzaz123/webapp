import { NgModule } from '@angular/core';
import { TrackingService } from './tracking.service';
import { TrackEventDirective } from './track-event.directive';
import { NavigatorService } from './navigator.service';
import { SplitTestService } from './split-test.service';

@NgModule({
  imports: [],
  exports: [
    TrackEventDirective
  ],
  declarations: [
    TrackEventDirective
  ],
  providers: [
    TrackingService,
    NavigatorService,
    SplitTestService
  ],
})
export class TrackingModule {
}

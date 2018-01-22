import { NgModule } from '@angular/core';
import { TrackingService } from './tracking.service';
import { TrackEventDirective } from './track-event.directive';

@NgModule({
  imports: [],
  exports: [
    TrackEventDirective
  ],
  declarations: [
    TrackEventDirective
  ],
  providers: [
    TrackingService
  ],
})
export class TrackingModule {
}

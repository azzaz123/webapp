import { NgModule } from '@angular/core';
import { TrackingService } from 'shield';
import { TrackDirective } from './track.directive';

@NgModule({
  imports: [],
  exports: [
    TrackDirective
  ],
  declarations: [
    TrackDirective
  ],
  providers: [
    TrackingService
  ],
})
export class TrackingModule {
}

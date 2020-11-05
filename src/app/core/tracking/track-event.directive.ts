import { Directive, HostListener, Input } from '@angular/core';
import { TrackingService } from './tracking.service';

@Directive({
  selector: '[tslTrackEvent]',
})
export class TrackEventDirective {
  @Input('tslTrackEvent') event: string;
  @Input() params: any;

  constructor(private trackingService: TrackingService) {}

  @HostListener('click') onClick() {
    this.trackingService.track(TrackingService[this.event], this.params);
  }
}

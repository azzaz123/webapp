import { Component, Input } from '@angular/core';
import { Lead } from '../../core/conversation/lead';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Observable } from 'rxjs';
import { Call } from '../../core/conversation/calls';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-unarchive-button',
  templateUrl: './unarchive-button.component.html',
  styleUrls: ['./unarchive-button.component.scss']
})
export class UnarchiveButtonComponent {

  @Input() lead: Lead;

  constructor(private trackingService: TrackingService,
              private callService: CallsService) {
  }

  unarchive(event: Event) {
    event.stopPropagation();
    let observable: Observable<any>;
    if (this.lead instanceof Call) {
      observable = this.callService.unarchive(this.lead.id);
    }
    observable.subscribe(() => {
      if (this.lead.phone) {
        this.trackingService.track(TrackingService.CALLS_MARK_PENDING);
      } else {
        this.trackingService.track(TrackingService.CONVERSATION_MARK_PENDING);
      }
    });
  }
}

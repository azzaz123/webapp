import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lead } from '../../core/conversation/lead';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Observable } from 'rxjs';
import { Call } from '../../core/conversation/calls';
import { CallsService } from '../../core/conversation/calls.service';

@Component({
  selector: 'tsl-archive-button',
  templateUrl: './archive-button.component.html',
  styleUrls: ['./archive-button.component.scss']
})
export class ArchiveButtonComponent {

  @Input() lead: Lead;
  @Output() click: EventEmitter<any> = new EventEmitter();

  constructor(private trackingService: TrackingService,
              private callService: CallsService) {
  }

  archive(event: Event) {
    event.stopPropagation();
    this.click.emit();
    let observable: Observable<any>;
    if (this.lead instanceof Call) {
      observable = this.callService.archive(this.lead.id);
    }
    observable.subscribe(() => {
      if (this.lead.phone) {
        this.trackingService.track(TrackingService.CALLS_PROCESSED);
      } else {
        this.trackingService.track(TrackingService.CONVERSATION_PROCESSED);
      }
    });
  }
}

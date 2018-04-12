import { Component, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lead } from '../../core/conversation/lead';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-unarchive-button',
  templateUrl: './unarchive-button.component.html',
  styleUrls: ['./unarchive-button.component.scss']
})
export class UnarchiveButtonComponent {

  @Input() lead: Lead;

  constructor(private conversationService: ConversationService,
              private trackingService: TrackingService) {
  }

  unarchive(event: Event) {
    event.stopPropagation();
    this.conversationService.unarchive(this.lead.id).subscribe(() => {
      this.trackingService.track(TrackingService.CONVERSATION_MARK_PENDING);
    });
  }

}

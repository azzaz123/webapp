import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lead } from '../../core/conversation/lead';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-archive-button',
  templateUrl: './archive-button.component.html',
  styleUrls: ['./archive-button.component.scss']
})
export class ArchiveButtonComponent {

  @Input() lead: Lead;
  @Output() click: EventEmitter<any> = new EventEmitter();

  constructor(private conversationService: ConversationService,
              private trackingService: TrackingService) {
  }

  archive(event: Event) {
    event.stopPropagation();
    this.click.emit();
    this.conversationService.archive(this.lead.id).subscribe(() => {
      this.trackingService.track(TrackingService.CONVERSATION_PROCESSED);
    });
  }

}

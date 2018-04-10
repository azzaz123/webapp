import { Component, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lead } from '../../core/conversation/lead';
import { ConversationService } from '../../core/conversation/conversation.service';

@Component({
  selector: 'tsl-unarchive-button',
  templateUrl: './unarchive-button.component.html',
  styleUrls: ['./unarchive-button.component.scss']
})
export class UnarchiveButtonComponent {

  @Input() lead: Lead;

  constructor(private conversationService: ConversationService) {
  }

  unarchive(event: Event) {
    event.stopPropagation();
    this.conversationService.unarchive(this.lead.id).subscribe();
  }

}

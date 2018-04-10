import { Component, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Lead } from '../../core/conversation/lead';
import { ConversationService } from '../../core/conversation/conversation.service';

@Component({
  selector: 'tsl-unarchive-button',
  templateUrl: './unarchive-button.component.html',
  styleUrls: ['./unarchive-button.component.scss']
})
export class UnarchiveButtonComponent implements OnDestroy {

  @Input() lead: Lead;
  private active: boolean = true;

  constructor(private conversationService: ConversationService) {
  }

  ngOnDestroy() {
    this.active = false;
  }

  unarchive(event: Event) {
    event.stopPropagation();
    this.conversationService.unarchive(this.lead.id).subscribe();
  }

}

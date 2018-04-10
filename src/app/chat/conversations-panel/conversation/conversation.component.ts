import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { Conversation } from '../../../core/conversation/conversation';
import { Remove } from '../../../shared/archivable/animations';
import { ConversationService } from '../../../core/conversation/conversation.service';

@Component({
  selector: 'tsl-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  animations: [Remove('1s 1s')]
})
export class ConversationComponent {

  @Input() conversation: Conversation;
  @Input() dashboard: boolean;
  @HostBinding('class.archive') archive: boolean = false;
  @HostBinding('class.archived') @HostBinding('@remove') archived: boolean = false;


  public momentConfig: any = {
    lastDay: 'ddd',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'ddd',
    nextWeek: 'ddd',
    sameElse: 'D MMM'
  };

  constructor(private conversationService: ConversationService) {
  }

  ngOnChanges(changes?: any) {
    this.archive = this.conversation.archived;
  }

  @HostListener('@remove.done') onAnimationDone($event: Event) {
    if (this.archived) {
      this.conversationService.stream();
    }
  }

}

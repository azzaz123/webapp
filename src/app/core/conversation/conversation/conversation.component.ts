import { Component, HostBinding, HostListener, Input, OnChanges } from '@angular/core';
import { ConversationService, Conversation } from 'shield';

@Component({
  selector: 'tsl-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnChanges {

  @Input() conversation: Conversation;
  @Input() dashboard: boolean;
  @HostBinding('class.archive') archive: boolean = false;


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


}

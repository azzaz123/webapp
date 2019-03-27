import { Component, Input } from '@angular/core';
import { InboxMessage } from '../message/inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation/inbox-conversation';

@Component({
  selector: 'tsl-current-conversation',
  templateUrl: './current-conversation.component.html',
  styleUrls: ['./current-conversation.component.scss']
})
export class CurrentConversationComponent {

  @Input() currentConversation: InboxConversation;

  constructor() { }

  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: 'dddd, D MMM',
    lastWeek: 'dddd, D MMM',
    nextWeek: 'dddd, D MMM',
    sameElse: 'dddd, D MMM'
  };

  public showDate(currentMessage: InboxMessage, nextMessage: InboxMessage): boolean {
    return nextMessage ? new Date(currentMessage.date).toDateString() !== new Date(nextMessage.date).toDateString() : true;
  }

  public dateIsThisYear(date) {
    return date.getFullYear() === new Date().getFullYear();
  }

}

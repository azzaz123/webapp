import { Component, Input, OnChanges } from '@angular/core';
import { InboxConversation } from './inbox-conversation';

@Component({
  selector: 'tsl-inbox-conversation',
  templateUrl: './inbox-conversation.component.html',
  styleUrls: ['./inbox-conversation.component.scss']
})
export class InboxConversationComponent {

  @Input() conversation: InboxConversation;

  public unreadCounterDisplayLimit = 99;
  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'D MMM.',
    nextWeek: 'ddd',
    sameElse: 'D MMM.'
  };

  constructor() { }

  public dateIsThisYear(): boolean {
    if (this.conversation && this.conversation.modifiedDate) {
      return this.conversation.modifiedDate.getFullYear() === new Date().getFullYear();
    }
    return false;
  }

  public userIsAvailable(): boolean {
    return this.conversation.user.available;
  }
}

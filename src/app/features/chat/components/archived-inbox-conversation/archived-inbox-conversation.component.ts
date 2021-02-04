import { Component, Input, OnChanges } from '@angular/core';
import { InboxConversation } from '@features/chat/core/model';

import { CalendarSpec } from 'moment';
@Component({
  selector: 'tsl-archived-inbox-conversation',
  templateUrl: './archived-inbox-conversation.component.html',
  styleUrls: ['./archived-inbox-conversation.component.scss'],
})
export class ArchivedInboxConversationComponent {
  @Input() conversation: InboxConversation;

  public unreadCounterDisplayLimit = 99;
  public momentConfig: CalendarSpec = {
    lastDay: '[Yesterday]',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'D MMM.',
    nextWeek: 'ddd',
    sameElse: 'D MMM.',
  };

  constructor() {}

  public dateIsThisYear(): boolean {
    if (this.conversation && this.conversation.modifiedDate) {
      return this.conversation.modifiedDate.getFullYear() === new Date().getFullYear();
    }
    return false;
  }
}

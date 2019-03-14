import { Component, Input, OnChanges } from '@angular/core';
import { InboxConversation } from '../../../core/conversation/conversation';
import { INBOX_ITEM_STATUSES } from '../../../core/item/item';

@Component({
  selector: 'tsl-inbox-conversation',
  templateUrl: './inbox-conversation.component.html',
  styleUrls: ['./inbox-conversation.component.scss']
})
export class InboxConversationComponent implements OnChanges {

  @Input() conversation: InboxConversation;

  public momentConfig: any = {
    lastDay: '[Yesterday]',
    sameDay: 'HH:mm',
    nextDay: 'ddd',
    lastWeek: 'D MMM.',
    nextWeek: 'ddd',
    sameElse: 'D MMM.'
  };

  constructor() { }

  public cannotChat = false;

  ngOnChanges() {
    this.cannotChat = this.conversation.user.blocked
    || !this.conversation.user.available
    || this.conversation.item.status === INBOX_ITEM_STATUSES.notAvailable;
  }


  public dateIsThisYear() {
    if (this.conversation && this.conversation.modifiedDate) {
      return this.conversation.modifiedDate.getFullYear() === new Date().getFullYear();
    }
    return false;
  }
}

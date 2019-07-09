import { Input, OnInit } from '@angular/core';

import { InboxMessage } from './inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation';
import { InboxItem, InboxUser } from '../inbox';

export abstract class MessageComponent implements OnInit {

  @Input() message: InboxMessage;
  @Input() user: InboxUser;
  @Input() item: InboxItem;

  @Input() currentConversation: InboxConversation;

  ngOnInit() {
    this.currentConversation = this.message.phoneRequest ? this.currentConversation : null;
  }
}

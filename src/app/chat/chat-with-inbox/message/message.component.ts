import { Input, OnInit } from '@angular/core';

import { InboxMessage } from './inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation';

export class MessageComponent implements OnInit {

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;

  ngOnInit() {
  }

}

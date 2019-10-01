import { Input, OnInit } from '@angular/core';

import { InboxMessage } from './inbox-message';
import { InboxConversation } from '../inbox/inbox-conversation';
import { InboxItem, InboxUser } from '../inbox';

export abstract class MessageComponent implements OnInit {

  private readonly HTML_REGEX = /<[a-z][\s\S]*>/i;

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;

  ngOnInit() {
    this.currentConversation = this.message.phoneRequest ? this.currentConversation : null;
  }

  public messageContainsHTMLTag(): boolean {
    return this.containsHTMLTag(this.message.text);
  }

  public containsHTMLTag(message: string): boolean {
    return this.HTML_REGEX.test(message);
  }
}
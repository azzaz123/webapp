import { Input, OnInit } from '@angular/core';

import { InboxMessage } from '../model/inbox-message';
import { InboxConversation } from '../model/inbox-conversation';

export abstract class MessageComponent implements OnInit {

  private readonly HTML_REGEX = /<[a-z][\s\S]*>/i;

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;

  ngOnInit() {
  }

  public messageContainsHTMLTag(): boolean {
    return this.containsHTMLTag(this.message.text);
  }

  public containsHTMLTag(message: string): boolean {
    return this.HTML_REGEX.test(message);
  }
}

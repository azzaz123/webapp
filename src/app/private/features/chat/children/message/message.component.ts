import { Directive, Input } from '@angular/core';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';

@Directive()
export abstract class MessageComponent {
  private readonly HTML_REGEX = /<[a-z][\s\S]*>/i;

  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;

  public;

  public containsHTMLTag(message: string): boolean {
    return this.HTML_REGEX.test(message);
  }
}

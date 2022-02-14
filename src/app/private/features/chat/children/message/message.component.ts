import { Directive, Input } from '@angular/core';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';

@Directive()
export abstract class MessageComponent {
  @Input() message: InboxMessage;
  @Input() currentConversation: InboxConversation;

  private readonly HTML_REGEX = /<[a-z][\s\S]*>/i;

  public containsHTMLTag(message: string): boolean {
    return this.HTML_REGEX.test(message);
  }
}

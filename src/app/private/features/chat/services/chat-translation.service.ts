import { Injectable } from '@angular/core';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';

@Injectable()
export class ChatTranslationService {
  public translateConversation(conversation: InboxConversation): void {
    const [first, last] = this.getFirstAndLastTranslatableMessageIds(conversation);
    console.log(conversation.id, first, last);
  }

  private getFirstAndLastTranslatableMessageIds(conversation: InboxConversation): [InboxMessage, InboxMessage] {
    const messages = conversation.messages
      .filter((message) => !message.fromSelf)
      .filter((message) => !message.translation)
      .sort((messageA, messageB) => {
        return messageA.date.getTime() - messageB.date.getTime();
      });

    return [messages[0], messages[messages.length - 1]];
  }
}

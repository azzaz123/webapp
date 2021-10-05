import { Injectable } from '@angular/core';
import { InboxConversation, InboxMessage } from '@private/features/chat/core/model';
import { ChatApiService } from '@api/chat/chat-api.service';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MessageTranslation } from '@api/core/model/chat';

@Injectable()
export class ChatTranslationService {
  public constructor(private chatApiService: ChatApiService) {}

  public translateConversation(conversation: InboxConversation): Observable<void> {
    const messages = this.getTranslatableMessages(conversation);

    return messages.length ? this.translateMessages(conversation.id, messages) : of(void 0);
  }

  private translateMessages(conversationId: string, messages: InboxMessage[]): Observable<void> {
    return this.chatApiService.translateMessages(conversationId, messages).pipe(
      take(1),
      map((messageTranslations: MessageTranslation[]) => {
        messages.forEach((message) => {
          const translatedMessage = messageTranslations.find((translation) => translation.id === message.id);
          if (translatedMessage) {
            message.translation = translatedMessage.translation;
          }
        });
      })
    );
  }

  private getTranslatableMessages(conversation: InboxConversation): InboxMessage[] {
    return conversation.messages.filter((message) => !message.fromSelf).filter((message) => !message.translation);
  }
}

import { Injectable } from '@angular/core';
import { ChatHttpService } from '@api/chat/http/chat-http.service';
import { MessageTranslation } from '@api/core/model/chat';
import { InboxMessage } from '@private/features/chat/core/model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapTranslateMessagesResponseToMessageTranslations } from '@api/chat/mappers';
import { TranslateMessagesResponse } from '@api/chat/dtos';

@Injectable()
export class ChatApiService {
  public constructor(private httpService: ChatHttpService) {}

  public translateMessages(conversationId: string, messages: InboxMessage[]): Observable<MessageTranslation[]> {
    if (!messages.length) {
      return of([]);
    }

    const [first, last] = this.getFirstAndLastMessage(messages);

    return this.httpService
      .translateMessages(conversationId, first.id, first.date.getTime(), last.id, last.date.getTime())
      .pipe(map((response: TranslateMessagesResponse) => mapTranslateMessagesResponseToMessageTranslations(response)));
  }

  private getFirstAndLastMessage(messages: InboxMessage[]): [InboxMessage, InboxMessage] {
    messages.sort((messageA, messageB) => {
      return messageA.date.getTime() - messageB.date.getTime();
    });

    return [messages[0], messages[messages.length - 1]];
  }
}

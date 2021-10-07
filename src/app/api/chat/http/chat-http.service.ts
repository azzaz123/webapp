import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateMessagesResponse } from '@api/chat/dtos';
import { Observable } from 'rxjs';
import { TRANSLATE_MESSAGES_ENDPOINT } from './endpoints';

@Injectable()
export class ChatHttpService {
  public constructor(private http: HttpClient) {}

  public translateMessages(
    conversationId: string,
    firstId: string,
    firstTimestamp: number,
    lastId: string,
    lastTimestamp: number
  ): Observable<TranslateMessagesResponse> {
    return this.http.post<TranslateMessagesResponse>(TRANSLATE_MESSAGES_ENDPOINT, {
      conversation_id: conversationId,
      first_message_timestamp: firstTimestamp,
      first_message_id: firstId,
      last_message_timestamp: lastTimestamp,
      last_message_id: lastId,
    });
  }
}

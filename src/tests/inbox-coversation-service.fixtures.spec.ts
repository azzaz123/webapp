
import {empty as observableEmpty,  Observable, of } from 'rxjs';

import { InboxConversation } from '../app/chat/model';

export class InboxConversationServiceMock {

  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];

  openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    return observableEmpty();
  }

  openConversationByConversationId$(conversation: string): Observable<InboxConversation> {
    return observableEmpty();
  }

  public openConversation(conversation: InboxConversation): void {
  }

  archive$(conversation: InboxConversation): Observable<InboxConversation> {
    return of(conversation);
  }

  sendReadSignal(conversation: InboxConversation): void {
  }

  resendPendingMessages(conversation: InboxConversation): void {
  }

  addPhoneNumberToConversation$(inboxConversation: InboxConversation, phoneNumber: string): Observable<any> {
    return observableEmpty();
  }
}

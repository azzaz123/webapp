import { InboxConversation } from '@private/features/chat/core/model';
import { EMPTY, Observable, of } from 'rxjs';

export class InboxConversationServiceMock {
  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];

  openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    return EMPTY;
  }

  openConversationByConversationId$(conversation: string): Observable<InboxConversation> {
    return EMPTY;
  }

  public openConversation(conversation: InboxConversation): void {}

  archive$(conversation: InboxConversation): Observable<InboxConversation> {
    return of(conversation);
  }

  sendReadSignal(conversation: InboxConversation): void {}

  resendPendingMessages(conversation: InboxConversation): void {}

  addPhoneNumberToConversation$(inboxConversation: InboxConversation, phoneNumber: string): Observable<any> {
    return EMPTY;
  }

  loadMoreMessages() {}
}

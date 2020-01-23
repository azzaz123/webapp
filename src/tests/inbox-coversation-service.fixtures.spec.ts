import { Observable, of } from 'rxjs';
import { InboxConversation } from '../app/chat/model';

export class InboxConversationServiceMock {

  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];

  openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    return Observable.empty();
  }

  openConversationByConversationId$(conversation: string): Observable<InboxConversation> {
    return Observable.empty();
  }

  archive$(conversation: InboxConversation): Observable<InboxConversation> {
    return of(conversation);
  }

  sendReadSignal(conversation: InboxConversation): void {
  }

  resendPendingMessages(conversation: InboxConversation): void {
  }
}

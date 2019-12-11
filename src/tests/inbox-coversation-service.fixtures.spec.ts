import { Observable, of } from 'rxjs';
import { InboxConversation } from '../app/chat/model';

export class InboxConversationServiceMock {

  openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    return Observable.empty();
  }

  archive$(conversation: InboxConversation): Observable<InboxConversation> {
    return of(conversation);
  }

  sendReadSignal(conversation: InboxConversation): void {
  }

  resentPendingMessages(conversation: InboxConversation): void {
  }
}

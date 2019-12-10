import { Observable } from 'rxjs';
import { InboxConversation } from '../app/chat/model';

export class InboxConversationServiceMock {

  openConversationByItemId$(itemId: string): Observable<InboxConversation> {
    return Observable.empty();
  }
}

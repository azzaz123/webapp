import { InboxConversation } from '../app/chat/model';
import { Observable } from 'rxjs';

export class InboxServiceMock {
  public conversations: InboxConversation[] = [];
  public archivedConversations: InboxConversation[] = [];

  public getInboxFeatureFlag$(): Observable<boolean> {
    return Observable.of(false);
  }
}
